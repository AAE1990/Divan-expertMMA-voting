import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '@/app.module';

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let testEmail: string;

  beforeAll(async () => {
    testEmail = `jestuser${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  // ТЕСТ 1: Успешная регистрация нового человека
  it('/auth/register (POST) -> Успешная регистрация нового человека', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: 'Password123!',
        passwordRepeat: 'Password123!',
        name: 'Jest Fighter'
      })
      .expect(200)
      .then((response: any) => {
        expect(response.body).toHaveProperty('message');
      });
  });

  // ТЕСТ 2: Защита от дубликатов (или мягкое слияние сессий)
  it('/auth/register (POST) -> Выдает статус 200 или ошибку при повторном email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: 'Password123!',
        passwordRepeat: 'Password123!',
        name: 'Clone Fighter'
      })
      .expect(409);
  });

  afterAll(async () => {
    await app.close();
  });
});
