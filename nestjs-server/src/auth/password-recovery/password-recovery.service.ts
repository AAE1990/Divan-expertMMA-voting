import { hash } from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { MailService } from '@/libs/mail/mail.service';
import { TokenType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordRecoveryService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly mailService: MailService,
    ) {}

    public async resetPassword(dto: ResetPasswordDto, locale: string = 'en') {
        const existingUser = await this.userService.findByEmail(dto.email)

        if (!existingUser) {
            throw new NotFoundException(
                'Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова'
            )
        }

        const passwordResetToken = await this.generatePasswordResetToken(
            existingUser.email
        )

        await this.mailService.sendPasswordResetEmail(
            passwordResetToken.email,
            passwordResetToken.token,
            locale
        )

        return true
    }

    public async newPassword(dto: NewPasswordDto, token: string, locale: string = 'en') {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        })

        if (!existingToken) {
            throw new NotFoundException({
                message: 'Токен не найден. Пожалуйста, проверьте, что у вас правильный токен или запросите новый.',
                code: 'TOKEN_NOT_FOUND'
            })
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException({
                message: 'Срок действия токена истек. Пожалуйста, запросите новый токен для сброса пароля.',
                code: 'TOKEN_EXPIRED'
            })
        }

        const existingUser = await this.userService.findByEmail(
            existingToken.email
        )

        if (!existingUser) {
            throw new NotFoundException(
                'Пользователь не найден. Пожалуйста, проверьте, что вы ввели правильный email и попробуйте снова.'
            )
        }

        await this.prismaService.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                password: await hash(dto.password)
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })
    }

    private async generatePasswordResetToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.PASSWORD_RESET
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.PASSWORD_RESET
                }
            })
        }

        const passwordResetToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.PASSWORD_RESET
            }
        })

        return passwordResetToken
    }
}
