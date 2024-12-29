import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'
import { join } from 'path'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  })

  const config = new DocumentBuilder()
    .setTitle('API SyncSpace')
    .setDescription('API SyncSpace description')
    .setVersion('1.0')
    // .addTag('cats')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  app.use('/docs', express.static(join(__dirname, '..', 'public')))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 422,
    }),
  )

  const appPort = Number(process.env.APP_PORT || 3333)

  await app.listen(appPort)
  console.log(`HTTP Server running on port ${appPort} 🌐`)
}
bootstrap()
