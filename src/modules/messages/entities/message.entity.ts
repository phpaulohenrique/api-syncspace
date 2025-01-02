import { MessageStatus } from '@/enum/message-status.enum'
import { MessageDocument } from '../schemas/message.schema'

export interface IMessage {
  id: string
  chatId: number
  senderId: number
  receiverId: number
  content: string
  status: MessageStatus
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export const convertMessageDocumentToMessageDTO = (msg: MessageDocument): IMessage => {
  return {
    id: msg?._id?.toString(),
    chatId: msg?.chatId,
    senderId: msg?.senderId,
    receiverId: msg?.receiverId,
    content: msg?.deletedAt instanceof Date ? null : msg?.content,
    status: msg?.status as MessageStatus,
    deletedAt: msg?.deletedAt?.toISOString(),
    createdAt: msg?.createdAt?.toISOString(),
    updatedAt: msg?.updatedAt?.toISOString(),
  }
}
