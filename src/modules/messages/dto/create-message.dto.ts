import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number

  @IsNumber()
  @IsNotEmpty()
  receiverId: number

  @IsDefined()
  @IsNumber()
  friendshipId: number

  @IsNumber()
  @IsOptional()
  chatId: number | null

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string
}
