import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (user) {
      throw new BadRequestException('User already exists')
    }

    await this.prisma.user.create({
      data: body,
    })
  }

  async findAllUsers(userId: number) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      include: {
        friendshipsInitiated: {
          where: {
            userIdReceived: userId,
          },
        },
        friendshipsReceived: {
          where: {
            userIdInitiated: userId,
          },
        },
      },
    })

    const usersWithFriendStatus = users.map((user) => {
      const isFriend = user.friendshipsInitiated.length > 0 || user.friendshipsReceived.length > 0

      const { friendshipsInitiated, friendshipsReceived, createdAt, ...userWithoutFriendships } =
        user

      return {
        ...userWithoutFriendships,

        isFriend,
      }
    })

    return { data: { users: usersWithFriendStatus } }
  }

  async findAllFriends(userId: number) {
    const friends = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            friendshipsInitiated: {
              some: {
                userIdReceived: userId,
              },
            },
          },

          {
            friendshipsReceived: {
              some: {
                userIdInitiated: userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return { data: { users: friends } }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
