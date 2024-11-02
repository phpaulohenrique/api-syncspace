import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'
import { join } from 'path'

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

  await app.listen(3333)
  console.log('HTTP Server running on port 3333 🌐')
}
bootstrap()
