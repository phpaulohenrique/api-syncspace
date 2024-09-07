import { BadRequestException, Injectable } from '@nestjs/common'
import { UpdateFriendshipDto } from './dto/update-friendship.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class FriendshipsService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createFriendshipDto: CreateFriendshipDto) {
  //   return 'This action adds a new friendship';
  // }

  async find(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ userIdInitiated: userId }, { userIdReceived: userId }],
      },
      include: {
        userInitiated: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        userReceived: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      // select: {
      //   userIdInitiated:?
      // }
    })

    const friends = friendships.map((friendship) =>
      friendship.userIdInitiated === userId
        ? {
            name: friendship.userReceived.name,
            id: friendship.userReceived.id,
            email: friendship.userReceived.email,
          }
        : {
            name: friendship.userInitiated.name,
            id: friendship.userInitiated.id,
            email: friendship.userInitiated.email,
          },
    )

    return {
      user,
      friends,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} friendship`
  }

  update(id: number, updateFriendshipDto: UpdateFriendshipDto) {
    return `This action updates a #${id} friendship`
  }

  remove(id: number) {
    return `This action removes a #${id} friendship`
  }
}
