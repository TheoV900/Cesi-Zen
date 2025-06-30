import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // 1️⃣ Crée l'application
  const app = await NestFactory.create(AppModule);

  // 2️⃣ Active CORS pour autoriser ton front (localhost:3000)
  app.enableCors({
    origin: 'http://localhost:3000',    // ou origin: true pour autoriser tous
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // 3️⃣ Configure Swagger (optionnel mais utile)
  const config = new DocumentBuilder()
    .setTitle('CESI-Zen API')
    .setDescription('Endpoints de l’API CESI-Zen')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 4️⃣ Démarre sur le port 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}

bootstrap();
