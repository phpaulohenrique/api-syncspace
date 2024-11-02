import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number

  @IsNumber()
  @IsNotEmpty()
  receiverId: number

  @IsNumber()
  @IsNotEmpty()
  friendshipId: number

  @IsNumber()
  chatId: number | null

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  textMessage: string
}
