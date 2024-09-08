import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common'
import { FriendRequestsService } from './friend-request.service'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'
import { ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger'

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Resource successfully created.' })
  @ApiBadRequestResponse({ 
    description: 'Bad request error. Possible reasons include: User cannot send a friend request to yourself, Friend request already exists.' 
  })
  @ApiNotFoundResponse({ 
    description: 'Not found error. Possible reasons include: SenderId not found, ReceiverId not found.' 
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
  updateToAccept(@Param('id') id: string) {
    return this.friendRequestsService.updateToAccepted(+id)
  }

  @Patch('/reject/:id')
  updateToRejected(@Param('id') id: string) {
    return this.friendRequestsService.updateToRejected(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendRequestsService.remove(+id)
  }
}
