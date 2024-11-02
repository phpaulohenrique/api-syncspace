import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { FriendRequestModule } from './modules/friend-requests/friend-request.module'
import { FriendshipsModule } from './modules/friendships/friendships.module'
import { ChatsModule } from './modules/chats/chats.module'
import { WebsocketModule } from './websocket/websocket.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://mongo:docker@localhost:27017'),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    FriendRequestModule,
    FriendshipsModule,
    ChatsModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
