import { Module } from '@nestjs/common'
import { WebsocketService } from './websocket.service'
import { ChatGateway } from './chat.gateway'
// import { WebsocketGateway } from './websocket.gateway';

@Module({
  // TODO: chat gateway here???
  providers: [WebsocketService, ChatGateway],
})
export class WebsocketModule {}
