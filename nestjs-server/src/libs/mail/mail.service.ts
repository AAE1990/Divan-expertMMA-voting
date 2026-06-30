import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { render } from '@react-email/components';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // Инициализируем Resend API-ключом, который лежит в MAIL_PASSWORD
    this.resend = new Resend(this.configService.getOrThrow<string>('MAIL_PASSWORD'));
  }

  public async sendConfirmationEmail(email: string, token: string, locale: string = 'en') {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token, locale }));
    const subject = locale === 'en' ? 'Confirm your email' : 'Подтверждение почты';

    return this.sendMail(email, subject, html);
  }

  public async sendPasswordResetEmail(email: string, token: string, locale: string = 'en') {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token, locale }));
    const subject = locale === 'en' ? 'Reset your password' : 'Сброс пароля';

    return this.sendMail(email, subject, html);
  }

  public async sendTwoFactorAuthEmail(email: string, token: string, locale: string = 'en') {
    const html = await render(TwoFactorAuthTemplate({ token }));
    const subject = locale === 'en' ? 'Verify your identity' : 'Подтверждение вашей личности';

    return this.sendMail(email, subject, html);
  }

  // Переписываем этот метод на работу через HTTP API вместо SMTP
  private async sendMail(email: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.configService.getOrThrow<string>('MAIL_FROM'), // Твой красивый noreply@couch-expert-mma.com
        to: [email],
        subject: subject,
        html: html,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (e) {
      console.error('Ошибка отправки через Resend API:', e);
      throw e;
    }
  }
}
