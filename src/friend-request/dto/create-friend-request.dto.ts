import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFriendRequestDto {
  @IsInt()
  @IsNotEmpty()
  senderId: number;

  @IsInt()
  @IsNotEmpty()
  receiverId: number;
}
