import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TokenType, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDto } from './dto/confirmation.dto';
import { Request } from 'express';
import { MailService } from '@/libs/mail/mail.service';
import { UserService } from '@/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class EmailConfirmationService {
    private readonly logger = new Logger(EmailConfirmationService.name)

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

    public async newVerification(req: Request, dto: ConfirmationDto, locale: string = 'en'){
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token: dto.token,
                type: TokenType.VERIFICATION
            }
        })

        if (!existingToken) {
            throw new NotFoundException({
                message: 'Токен подтверджения не найден. Пожалуйста, убедитесь, что у вас правильный токен.',
                code: 'TOKEN_NOT_FOUND'
            })
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException({
                message: 'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения.',
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
                isVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.VERIFICATION
            }
        })

        return this.authService.saveSession(req, existingUser)
    }

    public async sendVerificationToken(email: string, locale: string = 'en') {
        const verificationToken = await this.generateVerificationToken(
            email
        )

        try {
            await this.mailService.sendConfirmationEmail(
                verificationToken.email,
                verificationToken.token,
                locale
            )
        } catch (err) {
            this.logger.warn(
                `Не удалось отправить письмо подтверждения на ${email}: ${err instanceof Error ? err.message : String(err)}`
            )
        }
    }

    public async generateVerificationToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000)
 
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.VERIFICATION
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.VERIFICATION
                }
            })
        }

        const verificationToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.VERIFICATION
            }
        })

        return verificationToken
    }
}
