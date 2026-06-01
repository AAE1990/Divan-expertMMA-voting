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
    @Body() dto: ResetPasswordDto & { locale?: string }, // Разрешаем locale в body
    @Query('locale') queryLocale?: string
  ) {
    // Ищем везде: сначала в query, потом в body, если пусто — берём 'en'
    const locale = queryLocale || dto.locale || 'en'
    return this.passwordRecoveryService.resetPassword(dto, locale)
  }

  @Recaptcha()
  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Body() dto: NewPasswordDto & { locale?: string }, // Берём locale из body!
    @Param('token') token: string
  ) {
    // Спокойно забираем locale из body, если фронтенд её прислал, иначе 'en'
    const locale = dto.locale || 'en'
    return this.passwordRecoveryService.newPassword(dto, token, locale)
  }
}

