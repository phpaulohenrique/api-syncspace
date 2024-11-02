import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { PrismaService } from 'src/prisma.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from './schemas/message.schema'
import { ChatGateway } from 'src/websocket/chat.gateway'

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly messagesGateway: ChatGateway,
  ) {}

  async create(body: CreateMessageDto) {
    // TODO: verificar se o chat id existe??
    let chatId = body.chatId

    if (!chatId) {
      // TODO: validação de segurança
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
        return
      }

      if (!chatExists.available) {
        throw new ForbiddenException('User can not send messages on this chat')
      }

      chatId = chatExists.id
    }

    const message = new this.messageModel({
      chatId,
      content: body.textMessage,
      senderId: body.senderId,
      receiverId: body.receiverId,
    })

    await message.save()
    this.messagesGateway.sendMessage(String(chatId), body.textMessage)
  }

  async findAllByChat(chatId: number) {
    // TODO: verificar quem ta chamando essa rota

    const messages = await this.messageModel.find({ chatId })

    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      textMessage: msg.content,
      createdAt: msg.createdAt,
      chatId: msg.chatId,
      receiverId: msg?.receiverId,
      senderId: msg?.senderId,
      status: msg?.status,
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

  remove(id: number) {
    return `This action removes a #${id} message`
  }
}
