import { Module } from '@nestjs/common'
import { WebsocketService } from './websocket.service'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [],
  providers: [WebsocketService], // TODO: ADD CHAT GATEWAY HERE?
})
export class WebsocketModule {}
