import { Module } from '@nestjs/common'
import { FriendRequestsController } from './friend-request.controller'
import { PrismaService } from 'src/prisma.service'
import { FriendRequestsService } from './friend-request.service'

@Module({
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService, PrismaService],
})
export class FriendRequestModule {}
