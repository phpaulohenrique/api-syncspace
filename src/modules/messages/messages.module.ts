import { Module } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { PrismaService } from '../../prisma.service'
import { MongooseModule } from '@nestjs/mongoose'

import { Message, MessageSchema } from './schemas/message.schema'
import { ChatGateway } from '../../websocket/chat.gateway'
import { LogService } from '../../log.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, ChatGateway, LogService],
})
export class MessagesModule {}
