import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'
import { PrismaService } from 'src/prisma.service'
import { FriendRequestStatus } from '@prisma/client'

@Injectable()
export class FriendRequestService {
  constructor(private readonly prisma: PrismaService) {}
  async create(body: CreateFriendRequestDto) {
    if (body.receiverId === body.senderId) {
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

    const receiver = await this.prisma.user.findUnique({
      where: {
        id: body.receiverId,
      },
    })

    if (!sender) {
      throw new NotFoundException('SenderId not found')
    }

    if (!receiver) {
      throw new NotFoundException('ReceiverId not found')
    }

    await this.prisma.friendRequest.create({
      data: {
        receiverId: body.receiverId,
        senderId: body.senderId,
        status: FriendRequestStatus.PENDING,
      },
      // include: {
      //   receiver: true,
      //   sender: true,
      // },
    })

    // return friendRequest;
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
      pending_requests: pendingRequests,
    }
  }

  async updateToAccepted(id: number) {
    // TODO: verificar pelo token se quem está disparando essa rota é o receiverId

    try {
      await this.prisma.$transaction(async (prisma) => {
        const friendRequest = await prisma.friendRequest.findUnique({
          where: { id },
          select: { receiverId: true, senderId: true, id: true },
        })

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
    } catch (error) {
      console.error('Error processing friend accept:', error)
      throw new Error('Unable to process the friend request')
    }
  }

  async updateToRejected(id: number) {
    // TODO: verificar pelo token se quem esta disparando essa rota é o receiverID
    await this.prisma.friendRequest.update({
      where: {
        id,
      },
      data: {
        status: 'REJECTED',
      },
    })
  }

  remove(id: number) {
    return `This action removes a #${id} friendRequest`
  }
}
