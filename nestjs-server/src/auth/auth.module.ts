import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { getRecaptchaonfig } from '@/config/recapthca.config';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { ProviderModule } from './provider/provider.module';
import { getProvidersConfig } from '@/config/providers.config';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { UserService } from '@/user/user.service';
import { MailService } from '@/libs/mail/mail.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService]
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // ДОБАВЛЯЕМ AWAIT СЮДА:
        const config = await getRecaptchaonfig(configService);
        return {
          ...config,
          secretKey: config.secretKey || 'dummy-key',
          skipIf: () => process.env.NODE_ENV === 'test',
        };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => EmailConfirmationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService, TwoFactorAuthService],
  exports: [AuthService],
})
export class AuthModule {}
