import { Module } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { ChatsController } from './chats.controller'
import { MessagesModule } from 'src/messages/messages.module'

@Module({
  imports: [MessagesModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
