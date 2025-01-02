import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { IMessage } from '../modules/messages/entities/message.entity'

// const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT)

@WebSocketGateway(81, { transports: ['websocket'] })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server

  afterInit(server: Server) {
    console.log('WebSocket Server running on port 81 🚀')
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId)
    console.log(`Client ${client.id} joined chat ${chatId}`)
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(client: Socket, chatId: string) {
    client.leave(chatId)
    console.log(`Client ${client.id} left chat ${chatId}`)
  }

  sendMessage(chatId: string, message: IMessage) {
    this.server.to(chatId).emit('messageNew', message)
  }

  readMessage(chatId: string, messages: IMessage[]) {
    this.server.to(chatId).emit('messageRead', messages)
  }

  deleteMessage(chatId: string, messageId: string) {
    this.server.to(chatId).emit('messageDeleted', messageId)
  }
}
