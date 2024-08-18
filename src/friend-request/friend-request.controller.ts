import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  create(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    return this.friendRequestService.create(createFriendRequestDto);
  }

  @Get('pending/:id')
  findPending(@Param('id') id: string) {
    return this.friendRequestService.findAllPending(+id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendRequestService.findOne(+id);
  // }

  @Patch('/accept/:id')
  updateToAccept(@Param('id') id: string) {
    return this.friendRequestService.updateToAccepted(+id);
  }

  @Patch('/reject/:id')
  updateToRejected(@Param('id') id: string) {
    return this.friendRequestService.updateToRejected(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendRequestService.remove(+id);
  }
}
