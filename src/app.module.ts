import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { FriendshipsModule } from './friendships/friendships.module';

@Module({
  imports: [UsersModule, FriendRequestModule, FriendshipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
