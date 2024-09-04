import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'demo';
    app.enableCors({ origin: '*' });
    app.setGlobalPrefix(globalPrefix);

    const config = new DocumentBuilder()
        .setTitle('Carvach Fleet Demo API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        useGlobalPrefix: true,
    });

    await app.listen(8000);
}
bootstrap();
