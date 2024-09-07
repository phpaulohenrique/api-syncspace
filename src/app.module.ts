import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { FriendRequestModule } from './modules/friend-request/friend-request.module'
import { FriendshipsModule } from './modules/friendships/friendships.module'

@Module({
  imports: [UsersModule, FriendRequestModule, FriendshipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
