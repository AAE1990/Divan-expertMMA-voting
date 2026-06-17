import { plainToClass } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumberString, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    NODE_ENV: string;

    @IsString()
    @IsNotEmpty()
    MYSQL_URI: string;

    @IsString()
    @IsNotEmpty()
    REDIS_URI: string;

    @IsString()
    @IsNotEmpty()
    SESSION_SECRET: string;

    @IsString()
    @IsNotEmpty()
    APPLICATION_URL: string;

    @IsNumberString()
    APPLICATION_PORT: string;

    @IsString()
    @IsNotEmpty()
    COOKIES_SECRET: string;

    @IsString()
    @IsNotEmpty()
    SESSION_NAME: string;

    @IsString()
    @IsNotEmpty()
    SESSION_DOMAIN: string;

    @IsString()
    @IsNotEmpty()
    SESSION_MAX_AGE: string;

    @IsString()
    @IsIn(['true', 'false'])
    SESSION_HTTP_ONLY: string;

    @IsString()
    @IsIn(['true', 'false'])
    SESSION_SECURE: string;

    @IsString()
    @IsNotEmpty()
    SESSION_FOLDER: string;

    @IsString()
    @IsNotEmpty()
    MAIL_HOST: string;

    @IsNumberString()
    MAIL_PORT: string;

    @IsString()
    @IsNotEmpty()
    MAIL_LOGIN: string;

    @IsString()
    @IsNotEmpty()
    MAIL_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    MAIL_FROM: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_CLIENT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    YANDEX_CLIENT_ID: string;

    @IsString()
    @IsNotEmpty()
    YANDEX_CLIENT_SECRET: string;

    @IsString()
    @IsNotEmpty()
    GOOGLE_RECAPTCHA_SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    // Добавляем явный возврат объекта с MYSQL_URI, чтобы NestJS подхватил его как DATABASE_URL, если Prisma ищет его там
    return {
        ...validatedConfig,
        DATABASE_URL: config.MYSQL_URI,
    };
}
