import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema()
export class Message {
  @Prop({ required: true })
  chatId: number

  @Prop({ required: true })
  senderId: number

  @Prop({ required: true })
  receiverId: number

  @Prop({ required: true })
  content: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: 'NOT_READ', enum: ['NOT_READ', 'READ', 'DELETED'] })
  status: string

  @Prop({ default: null })
  deletedAt: Date | null
}
export type MessageDocument = HydratedDocument<Message>
export const MessageSchema = SchemaFactory.createForClass(Message)
