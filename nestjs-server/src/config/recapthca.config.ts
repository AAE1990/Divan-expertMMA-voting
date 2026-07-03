import { isDev } from "@/libs/common/utils/is-dev.util";
import { ConfigService } from "@nestjs/config";
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

export const getRecaptchaonfig = async (
    configService: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => ({
    secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
    response: req => req.headers.recaptcha,
    // Объединяем проверки: пропускаем капчу, если это локалка ИЛИ если в запросе есть код 2FA
    skipIf: (req: any) => isDev(configService) || !!req.body?.code
})
