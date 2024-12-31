import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'
import { PrismaService } from '../../prisma.service'
import { FriendRequestStatus } from '@prisma/client'

@Injectable()
export class FriendRequestsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(body: CreateFriendRequestDto) {
    if (Number(body.receiverId) === Number(body.senderId)) {
      throw new BadRequestException('User cannot send a friend request to yourself')
    }

    const friendRequestExists = await this.prisma.friendRequest.findFirst({
      where: {
        AND: [{ senderId: body.senderId }, { receiverId: body.receiverId }],
      },
    })

    if (friendRequestExists) {
      throw new BadRequestException('Friend request already exists')
    }

    const sender = await this.prisma.user.findUnique({
      where: {
        id: body.senderId,
      },
    })

    if (!sender) {
      throw new NotFoundException('SenderId not found')
    }

    const receiver = await this.prisma.user.findUnique({
      where: {
        id: body.receiverId,
      },
    })

    if (!receiver) {
      throw new NotFoundException('ReceiverId not found')
    }

    return await this.prisma.friendRequest.create({
      data: {
        receiverId: body.receiverId,
        senderId: body.senderId,
        status: FriendRequestStatus.PENDING,
      },
    })
  }

  async findAllPending(userId: number) {
    const pendingRequests = await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        AND: {
          status: 'PENDING',
        },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    return {
      data: {
        pending_requests: pendingRequests,
      },
    }
  }

  async accept(id: number) {
    // TODO: verificar pelo token se quem está disparando essa rota é o receiverId

    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: { id },
      select: { receiverId: true, senderId: true, id: true },
    })

    if (!friendRequest) {
      throw new NotFoundException('FriendRequest not found')
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.friendship.create({
        data: {
          userIdInitiated: friendRequest.senderId,
          userIdReceived: friendRequest.receiverId,
        },
      })

      await prisma.friendRequest.delete({
        where: { id: friendRequest.id },
      })
    })
  }

  async reject(id: number) {
    // TODO: verificar pelo token se quem esta disparando essa rota é o receiverID

    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: { id },
    })

    if (!friendRequest) {
      throw new NotFoundException('FriendRequest not found')
    }

    await this.prisma.friendRequest.delete({
      where: {
        id,
      },
    })
  }
}
