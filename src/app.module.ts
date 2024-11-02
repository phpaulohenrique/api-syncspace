import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { FriendRequestModule } from './modules/friend-requests/friend-request.module'
import { FriendshipsModule } from './modules/friendships/friendships.module'
import { ChatsModule } from './modules/chats/chats.module'
import { WebsocketModule } from './websocket/websocket.module'
import { MongooseModule } from '@nestjs/mongoose'
import { RedisModule } from '@liaoliaots/nestjs-redis'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
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
