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
        console.log('WebSocket Server running on port 81 🚀');
    }
    

    // Evento disparado quando uma mensagem é recebida do cliente
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string, client: Socket): void {
        // Emite a mensagem para todos os clientes conectados
        this.server.emit('message', message)
    }

  // Evento disparado quando um cliente se conecta
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`)
    }

    // Evento disparado quando um cliente desconecta
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`)
    }
}
