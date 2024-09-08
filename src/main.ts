import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  {
    logger: ['error', 'warn'],
  })

  const config = new DocumentBuilder()
    .setTitle('API SyncSpace')
    .setDescription('API SyncSpace description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  
  await app.listen(3333)
  console.log('HTTP Server running on port 3333 🌐');

}
bootstrap()
