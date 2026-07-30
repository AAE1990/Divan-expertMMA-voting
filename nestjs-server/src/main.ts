import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import IORedis from 'ioredis'
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ms, StringValue } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-boolean.utils';
import RedisStore from 'connect-redis';
import * as fs from 'fs';

async function bootstrap() {
  // Базовые опции логгера, которые у тебя уже были
  const nestOptions: any = {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  };

  // Пути к сертификатам, которые мы пробросили внутрь Docker-контейнера через volumes
  const keyPath = '/etc/letsencrypt/live/api.couch-expert-mma.com/privkey.pem';
  const certPath = '/etc/letsencrypt/live/api.couch-expert-mma.com/fullchain.pem';

  // Если файлы сертификатов физически существуют, включаем безопасный HTTPS режим
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    nestOptions.httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    console.log('🛡️ SSL Certificates found. Starting NestJS in secure HTTPS mode!');
  } else {
    console.log('⚠️ No SSL Certificates found. Starting NestJS in standard HTTP mode.');
  }

  // Создаем приложение с динамическими опциями
  const app = await NestFactory.create(AppModule, nestOptions);
  (app.getHttpAdapter().getInstance() as any).set('trust proxy', 1);

  const config = app.get(ConfigService)
  const redis = new IORedis(config.getOrThrow('REDIS_URI'))

  app.use((cookieParser as any)(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  app.use(
    (session as any)({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.get<string>('SESSION_DOMAIN') === 'none' ? undefined : config.get<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(
          config.getOrThrow<string>('SESSION_HTTP_ONLY')
        ),
        secure: config.get('SESSION_SECURE') === 'true' || config.get('SESSION_SECURE') === true,
        sameSite: config.get<any>('SESSION_SAME_SITE') || 'lax'
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER')
      })
    })
  )

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('couch-expert-mma.com') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie']
});

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
