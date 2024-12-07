import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto)
  }

  @Get()
  findAllByChat(@Query('chatId') chatId: string) {
    return this.messagesService.findAllByChat(+chatId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id)
  }

  // @Patch('read')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(+id, updateMessageDto)
  // }

  @Patch('/read')
  updateMessagesToRead(@Query('chatId') chatId: string) {
    return this.messagesService.updateMessagesToRead(+chatId)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id)
  }
}
