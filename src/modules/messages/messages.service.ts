import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { PrismaService } from 'src/prisma.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from './schemas/message.schema'
import { ChatGateway } from 'src/websocket/chat.gateway'
import { RedisService } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'

@Injectable()
export class MessagesService {
  private readonly redis: Redis | null

  constructor(
    private readonly messagesGateway: ChatGateway,
    private readonly prisma: PrismaService,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow()
  }

  async create(body: CreateMessageDto) {
    let chatId = body.chatId
    const redisKey = `chatId:${body.friendshipId}`

    if (!chatId) {
      const cachedChatId = await this.redis.get(redisKey)

      if (cachedChatId) {
        chatId = Number(cachedChatId)
      } else {
        const chatExists = await this.prisma.chat.findFirst({
          where: {
            friendshipId: body.friendshipId,
          },
        })

        if (!chatExists) {
          const friendshipExists = await this.prisma.friendship.findUnique({
            where: {
              id: body.friendshipId,
            },
          })

          if (!friendshipExists) {
            throw new NotFoundException('Friendship not found')
          }

          const chatCreated = await this.prisma.chat.create({
            data: {
              available: true,
              friendshipId: body.friendshipId,
            },
          })

          chatId = chatCreated.id
          await this.redis.set(redisKey, chatId)
          return
        }

        if (!chatExists.available) {
          throw new ForbiddenException('User can not send messages on this chat')
        }

        chatId = chatExists.id
      }
    }

    await this.redis.set(redisKey, chatId)

    const message = new this.messageModel({
      chatId,
      content: body.textMessage,
      senderId: body.senderId,
      receiverId: body.receiverId,
    })

    await message.save()
    this.messagesGateway.sendMessage(String(chatId), message)
  }

  async findAllByChat(chatId: number) {
    // TODO: verificar quem ta chamando essa rota

    const messages = await this.messageModel.find({ chatId })

    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      textMessage: msg.deletedAt instanceof Date ? null : msg.content,
      chatId: msg.chatId,
      receiverId: msg.receiverId,
      senderId: msg.senderId,
      status: msg.status,
      createdAt: msg.createdAt,
      deletedAt: msg.deletedAt,
    }))

    return {
      data: {
        messages: formattedMessages,
      },
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} message`
  }

  async updateMessagesToRead(chatId: number) {
    // TODO: GET CURRENT USER FROM TOKEN

    const userIdReading = 7

    await this.messageModel.updateMany(
      {
        receiverId: userIdReading,
        chatId,
      },
      { $set: { status: 'READ' } }, // Atualiza o campo 'status' para 'READ'
    )

    // return `This action updates a #${chatId} message`
  }

  async remove(id: string) {
    // Verificar se a mensagem existe
    const message = await this.messageModel.findOne({ _id: id })
    if (!message) {
      throw new NotFoundException(`Message not found`)
    }

    await this.messageModel.updateOne(
      { _id: id },
      { $set: { deletedAt: Date.now(), status: 'DELETED' } },
    )

    this.messagesGateway.deleteMessage(String(message.chatId), id)
  }
}
