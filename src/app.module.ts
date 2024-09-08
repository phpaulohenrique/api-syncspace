import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { FriendRequestModule } from './modules/friend-requests/friend-request.module'
import { FriendshipsModule } from './modules/friendships/friendships.module'
import { ChatsModule } from './modules/chats/chats.module'
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [UsersModule, FriendRequestModule, FriendshipsModule, ChatsModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
