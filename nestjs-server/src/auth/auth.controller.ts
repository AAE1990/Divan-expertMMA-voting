import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, Get, UseGuards, Param, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProviderGuard } from './guards/provider.guard';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService
  ) { }

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Req() req: Request, @Body() dto: RegisterDto, @Query('locale') locale?: string) {
    return this.authService.register(dto, dto.locale)
  }
  
  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() req: Request, @Body() dto: LoginDto, @Query('locale') locale?: string) {
    return this.authService.login(req, dto, dto.locale)
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true}) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string,
    @Query('state') state?: string
  ) {
    if (!code) {
      throw new BadRequestException(
        'Не был предоставлен код авторизации'
      )
    }

    await this.authService.extractProfileFromCode(req, provider, code)

    const baseUrl = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const redirectPath = state ? `/${state}/dashboard/settings` : '/dashboard/settings'
    return res.redirect(`${baseUrl}${redirectPath}`)
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(
    @Param('provider') provider: string,
    @Query('locale') locale?: string
  ) {
    const providerInstance = this.providerService.findByService(provider)

    return {
      url: providerInstance!.getAuthUrl(locale)
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true}) res: Response) {
    return this.authService.logout(req, res)
  }
}
