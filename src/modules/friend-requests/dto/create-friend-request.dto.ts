import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'

export class CreateFriendRequestDto {
  @ApiProperty({
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  senderId: number

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  receiverId: number
}
