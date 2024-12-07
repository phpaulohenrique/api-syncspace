import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

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

  // Evento disparado quando uma mensagem é recebida do cliente
  //   @SubscribeMessage('message')
  //   handleMessage(@MessageBody() message: string, client: Socket): void {
  //     // Emite a mensagem para todos os clientes conectados
  //     this.server.emit('message', message)
  //   }

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

  sendMessage(chatId: string, message: object) {
    // TODO: enviar objeto
    this.server.to(chatId).emit('newMessage', message)
  }

  deleteMessage(chatId: string, messageId: string) {
    this.server.to(chatId).emit('messageDeleted', messageId)
  }
}
