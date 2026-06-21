import { UserService } from '@/user/user.service';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthMethod, User } from '@prisma/client';
import { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly twoFactorAuthService: TwoFactorAuthService
    ) { }

    public async register(dto: RegisterDto, locale: string = 'en') {
        const isExists = await this.userService.findByEmail(dto.email)

        if (isExists) {
            throw new ConflictException({
                message: 'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.',
                code: 'EMAIL_ALREADY_IN_USE'
            })
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )

        await this.emailConfirmationService.sendVerificationToken(newUser.email, locale)

        return {
            message: locale === 'en'
                ? 'You have successfully registered! Please check your email to verify your account.'
                : 'Вы успешно зарегистрировались! Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.'
        };
    }

    public async login(req: Request, dto: LoginDto, locale: string = 'en') {
        const user = await this.userService.findByEmail(dto.email)

        if (!user || !user.password) {
            throw new NotFoundException({
                message: 'Пользователь не найден. Пожалуйста, провертье введенные данные',
                code: 'USER_NOT_FOUND'
            })
        }

        const isValidPassword = await verify(user.password, dto.password)

        if (!isValidPassword) {
            throw new UnauthorizedException({
                message: 'Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, если забыли его',
                code: 'INVALID_CREDENTIALS'
            })
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email, locale)
            throw new UnauthorizedException({
                message: 'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес',
                code: 'EMAIL_NOT_VERIFIED'
            })
        }

        if (user.isTwoFactorEnabled) {
            if (!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email, locale)

                return {
                    message:
                        'two_factor_required'
                }
            }

            await this.twoFactorAuthService.validateTwoFactorToken(
                user.email,
                dto.code,
                locale)

        }

        return this.saveSession(req, user)
    }

    public async extractProfileFromCode(
        req: Request,
        provider: string,
        code: string
    ) {
        const providerInstance = this.providerService.findByService(provider)
        if (!providerInstance) {
            throw new BadRequestException(`Сервис ${provider} не поддерживается`)
        }

        const profile = await providerInstance.findUserByCode(code)

        const account = await this.prismaService.account.findFirst({
            where: {
                id: profile.id,
                provider: profile.provider
            }
        })

        let user = account?.userId
            ? await this.userService.findById(account.userId) as any
            : null

        if (user) {
            return this.saveSession(req, user as any)
        }

        user = await this.userService.create(
            profile.email,
            '',
            profile.name,
            profile.picture,
            AuthMethod[profile.provider.toUpperCase()],
            true
        ) as any

        if (!account) {
            await this.prismaService.account.create({
                data: {
                    userId: user?.id,
                    type: 'oauth',
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at ?? 0
                }
            })
        }

        return this.saveSession(req, user as any)
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена'
                        )
                    )
                }
                res.clearCookie(
                    this.configService.getOrThrow<string>("SESSION_NAME")
                )
                resolve()
            })
        })
    }

    public async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии'
                        )
                    )
                }

                resolve({
                    user
                })
            })
        })
    }
}
