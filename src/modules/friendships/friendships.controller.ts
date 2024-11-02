import { Controller, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { FriendshipsService } from './friendships.service'
import { UpdateFriendshipDto } from './dto/update-friendship.dto'

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get('/me/:id')
  findMyFriends(@Param('id') id: string) {
    return this.friendshipsService.find(+id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendshipsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendshipDto: UpdateFriendshipDto) {
    return this.friendshipsService.update(+id, updateFriendshipDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendshipsService.remove(+id)
  }
}
