import { isDev } from "@/libs/common/utils/is-dev.util";
import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = async (
    configService: ConfigService
): Promise<MailerOptions> => {
    const port = configService.getOrThrow<string>('MAIL_PORT')
    const portNumber = parseInt(port, 10)
    
    // Порт 465 требует secure: true (SSL), порт 587 требует secure: false (TLS)
    const isSecurePort = portNumber === 465
    
    return {
        transport: {
            host: configService.getOrThrow<string>('MAIL_HOST'),
            port: portNumber,
            secure: isSecurePort,
            auth: {
                user: configService.getOrThrow<string>('MAIL_LOGIN'),
                pass: configService.getOrThrow<string>('MAIL_PASSWORD')
            },
            ...(portNumber === 587 && {
                tls: {
                    rejectUnauthorized: false
                }
            })
        },
        defaults: {
            from: configService.getOrThrow<string>('MAIL_FROM')
        }
    }
}