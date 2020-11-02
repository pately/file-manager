import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let restRequest: supertest.SuperTest<supertest.Test>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    restRequest = supertest(app.getHttpServer());
  });

  it('/file/random (GET) text/plain, application/json or application/xml', async () => {
    const response: supertest.Response = await restRequest
      .get('/file/random')
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(typeof response.text).toBe('string');
  });

  it('/file/random (GET) application/*', async () => {
    const response: supertest.Response = await restRequest
      .get('/file/random')
      .set('Content-Type', 'application/*');
    expect(response.status).toBe(200);
    const result = JSON.parse(response.text);
    expect(typeof result.randomLine).toBe('string');
    expect(typeof result.randomLineNumber).toBe('number');
    expect(typeof result.filename).toBe('string');
    expect(typeof result.mostFrequentCharacter).toBe('string');
  });

  it('/file/top20 (GET)', async () => {
    const response: supertest.Response = await restRequest.get('/file/top20');
    expect(response.status).toBe(200);
    expect(Array.isArray(JSON.parse(response.text))).toBe(true);
  });

  it('/file/top100 (GET)', async () => {
    const response: supertest.Response = await restRequest.get('/file/top100');
    expect(response.status).toBe(200);
    expect(Array.isArray(JSON.parse(response.text))).toBe(true);
  });
});
