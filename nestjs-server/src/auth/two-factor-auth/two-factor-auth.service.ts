import { MailService } from '@/libs/mail/mail.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TokenType } from '@prisma/client';

@Injectable()
export class TwoFactorAuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) { }

    public async validateTwoFactorToken(email: string, code: string, locale: string = 'en') {
        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        })

        if (!existingToken) {
            throw new NotFoundException({
                message: 'Токен двухфакторной авторизации не найден. Убедитесь, пожалуйста, что вы запрашивали токен для данного адреса электронной почты',
                code: 'TOKEN_NOT_FOUND'
            })
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (existingToken.token !== code) {
            throw new BadRequestException({
                message: 'Неверный код двухфакторной авторизации. Пожалуйста, проверьте введенный код и попробуйте снова.',
                code: 'INVALID_TOKEN'
            })
        }

        if (hasExpired) {
            throw new BadRequestException({
                message: 'Срок действия токена двухфакторной авторизации истек. Пожалуйста, запросите новый токен.',
                code: 'TOKEN_EXPIRED'
            })
        }

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.TWO_FACTOR
            }
        })

        return true
    }

    public async sendTwoFactorToken(email: string, locale: string = 'en') {
        const twoFactorToken = await this.generateTwoFactorToken(email)

        await this.mailService.sendTwoFactorAuthEmail(
            twoFactorToken.email,
            twoFactorToken.token,
            locale
        )

        return true
    }

    private async generateTwoFactorToken(email: string) {
        const token = Math.floor(
            Math.random() * (1000000 - 100000) + 100000
        ).toString()
        const expiresIn = new Date(new Date().getTime() + 300000)

        const existingToken = await this.prismaService.token.findFirst({
            where: {
                email,
                type: TokenType.TWO_FACTOR
            }
        })

        if (existingToken) {
            await this.prismaService.token.delete({
                where: {
                    id: existingToken.id,
                    type: TokenType.TWO_FACTOR
                }
            })
        }

        const twoFactorToken = await this.prismaService.token.create({
            data: {
                email,
                token,
                expiresIn,
                type: TokenType.TWO_FACTOR
            }
        })
        return twoFactorToken
    }
}
