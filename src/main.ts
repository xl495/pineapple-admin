import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/filters/http-exception/http-exception.filter';
import { ResultFormatInterceptor } from './utils/interceptor/result-format/result-format.interceptor';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResultFormatInterceptor());

  const config = new DocumentBuilder()
    .setTitle('swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port, () => {
    console.log(`
      Server is running on http://localhost:${port}
      Docs are running on http://localhost:${port}/api
    `);
  });
}
bootstrap();
