import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    public async sendConfirmationEmail(email: string, token: string, locale: string = 'en') {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ConfirmationTemplate({ domain, token, locale}))
        const subject = locale === 'en' ? 'Confirm your email' : 'Подтверждение почты'

        return this.sendMail(email, subject, html)
    }

    public async sendPasswordResetEmail(email: string, token: string, locale: string = 'en') {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ResetPasswordTemplate({ domain, token, locale}))
        const subject = locale === 'en' ? 'Reset your password' : 'Сброс пароля'

        return this.sendMail(email, subject, html)
    }

    public async sendTwoFactorAuthEmail(email: string, token: string, locale: string = 'en') {
        const html = await render(TwoFactorAuthTemplate({token}))
        const subject = locale === 'en' ? 'Verify your identity' : 'Подтверждение вашей личности'

        return this.sendMail(email, subject, html)
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html
        })
    }
}
