import { Module } from '@nestjs/common'
import { FriendshipsService } from './friendships.service'
import { FriendshipsController } from './friendships.controller'
import { PrismaService } from '../../prisma.service'

@Module({
  controllers: [FriendshipsController],
  providers: [FriendshipsService, PrismaService],
})
export class FriendshipsModule {}
