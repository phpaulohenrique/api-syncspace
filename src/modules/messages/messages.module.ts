import { Module } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { PrismaService } from 'src/prisma.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Message } from './entities/message.entity'
import { MessageSchema } from './schemas/message.schema'
import { ChatGateway } from 'src/websocket/chat.gateway'

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, ChatGateway],
})
export class MessagesModule {}
