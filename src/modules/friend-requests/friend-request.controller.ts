import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common'
import { FriendRequestsService } from './friend-request.service'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new friend request' })
  @ApiResponse({ status: 201, description: 'Resource successfully created.' })
  @ApiBadRequestResponse({
    description:
      'Bad request error. Possible reasons include: User cannot send a friend request to yourself, Friend request already exists.',
  })
  @ApiNotFoundResponse({
    description:
      'Not found error. Possible reasons include: SenderId not found, ReceiverId not found.',
  })
  create(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    return this.friendRequestsService.create(createFriendRequestDto)
  }

  @Get('pending/:id')
  findPending(@Param('id') id: string) {
    return this.friendRequestsService.findAllPending(+id)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendRequestsService.findOne(+id);
  // }

  @Patch('/accept/:id')
  accept(@Param('id') id: string) {
    return this.friendRequestsService.accept(+id)
  }

  @Patch('/reject/:id')
  reject(@Param('id') id: string) {
    return this.friendRequestsService.reject(+id)
  }

  /*  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendRequestsService.remove(+id)
  } */
}
