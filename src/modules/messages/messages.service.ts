import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { PrismaService } from '../../prisma.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from './schemas/message.schema'
import { ChatGateway } from 'src/websocket/chat.gateway'
import { RedisService } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { convertMessageDocumentToMessageDTO } from './entities/message.entity'
import { LogEvent, LogService } from 'src/log.service'
// import { InjectRedis } from '@nestjs-modules/ioredis'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class MessagesService {
  private readonly redis: Redis | null

  constructor(
    private readonly messagesGateway: ChatGateway,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly redisService: RedisService,
    // private readonly logService: LogService,
    // @InjectRedis() private readonly redis: Redis, // Injeção direta
  ) {
    this.redis = this.redisService.getOrThrow()
  }

  async create(body: CreateMessageDto) {
    const chatId = await this.handleChatIdResolution(body)
    const message = new this.messageModel({
      chatId,
      content: body.content,
      senderId: body.senderId,
      receiverId: body.receiverId,
    })

    await message.save()
    this.messagesGateway.sendMessage(String(chatId), convertMessageDocumentToMessageDTO(message))
    this.eventEmitter.emit(
      'log.created',
      new LogEvent(
        'msg_logs',
        `user_id: ${body.senderId} sent a message to user_id: ${body.receiverId}`,
      ),
    )
  }

  private async handleChatIdResolution(body: CreateMessageDto): Promise<number> {
    const redisKey = `chatId:${body.friendshipId}`
    let chatId = body.chatId

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
          return chatId
        }

        if (!chatExists.available) {
          throw new ForbiddenException('User can not send messages on this chat')
        }

        chatId = chatExists.id
      }
    }

    await this.redis.set(redisKey, chatId)
    return chatId
  }

  async findAllByChat(chatId: number) {
    // TODO: verificar quem ta chamando essa rota

    const messages = await this.messageModel.find({ chatId })

    const formattedMessages = messages.map((msg) => convertMessageDocumentToMessageDTO(msg))

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
    // TODO: QUEM VAI CHAMAR ESSA ROTA É QM ESTÁ LENDO A MSG

    const userIdReading = 2

    await this.messageModel.updateMany(
      {
        receiverId: userIdReading,
        chatId,
      },
      { $set: { status: 'READ' } },
    )

    const updatedMessages = await this.messageModel
      .find({
        receiverId: userIdReading,
        chatId,
        status: 'READ',
      })
      .exec()

    const messages = updatedMessages.map((msg) => convertMessageDocumentToMessageDTO(msg))

    this.messagesGateway.readMessage(String(chatId), messages)
  }

  async remove(id: string) {
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
