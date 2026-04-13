import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { MailService } from '@/libs/mail/mail.service';
import { UserService } from '@/user/user.service';

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, UserService, MailService],
})
export class PasswordRecoveryModule {}
