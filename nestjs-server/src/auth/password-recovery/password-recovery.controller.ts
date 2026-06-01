import { Body, Controller, HttpCode, HttpStatus, Post, Param, Query } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
    constructor(
      private readonly passwordRecoveryService: PasswordRecoveryService
    ) { }

    @Recaptcha()
    @Post('reset')
    @HttpCode(HttpStatus.OK)
    public async resetPassword(
      @Body() dto: ResetPasswordDto,
      @Query('locale') locale?: string
    ) {
      return this.passwordRecoveryService.resetPassword(dto, locale || 'en')
    }

    @Recaptcha()
    @Post('new/:token')
    @HttpCode(HttpStatus.OK)
    public async newPassword(
      @Body() dto: NewPasswordDto,
      @Param('token') token: string,
      @Query('locale') locale?: string
    ) {
      return this.passwordRecoveryService.newPassword(dto, token, locale)
    }
}


