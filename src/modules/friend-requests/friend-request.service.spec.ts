import { Test, TestingModule } from '@nestjs/testing'
import { FriendRequestsService } from './friend-request.service'
import { PrismaService } from '../../prisma.service'
import { createMock } from '@golevelup/ts-jest'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'
import { FriendRequestStatus } from '@prisma/client'

const user1Mock = { id: 1, name: 'John Doe', email: 'john.doe@gmail.com' }
const user2Mock = { id: 2, name: 'Ana Doe', email: 'ana.doe@gmail.com' }
const createFriendRequestBodyMock: CreateFriendRequestDto = { senderId: 1, receiverId: 2 }

const friendRequestPendingMock = {
  id: 1,
  senderId: 1,
  receiverId: 2,
  status: FriendRequestStatus.PENDING,
}

describe('FriendRequestService', () => {
  let friendRequestService: FriendRequestsService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestsService,
        { provide: PrismaService, useValue: createMock<PrismaService>() },
      ],
    }).compile()

    friendRequestService = module.get<FriendRequestsService>(FriendRequestsService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(friendRequestService).toBeDefined()
    expect(prismaService).toBeDefined()
  })

  describe('create', () => {
    it('should be able to send a friend request successfully', async () => {
      prismaService.friendRequest.findFirst = jest.fn().mockResolvedValue(null)
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValueOnce(user1Mock)
        .mockResolvedValueOnce(user2Mock)

      prismaService.friendRequest.create = jest.fn().mockResolvedValue(friendRequestPendingMock)

      const result = await friendRequestService.create(createFriendRequestBodyMock)

      expect(prismaService.friendRequest.findFirst).toHaveBeenCalledWith({
        where: { AND: [{ senderId: 1 }, { receiverId: 2 }] },
      })
      expect(prismaService.user.findUnique).toHaveBeenNthCalledWith(1, { where: { id: 1 } })
      expect(prismaService.user.findUnique).toHaveBeenNthCalledWith(2, { where: { id: 2 } })
      expect(prismaService.friendRequest.create).toHaveBeenCalledWith({
        data: { senderId: 1, receiverId: 2, status: FriendRequestStatus.PENDING },
      })

      expect(result).toEqual({
        data: {
          id: 1,
          senderId: 1,
          receiverId: 2,
          status: FriendRequestStatus.PENDING,
        },
      })
    })

    it('should throw an error case senderId is the same as receiverId', async () => {
      const bodyMock = { senderId: 1, receiverId: 1 }

      await expect(friendRequestService.create(bodyMock)).rejects.toThrow(
        new BadRequestException('User cannot send a friend request to yourself'),
      )
    })

    it('should not be able to create a friend request if senderId is not found', async () => {
      prismaService.friendRequest.findFirst = jest.fn().mockResolvedValue(null)

      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 2, name: 'Jane Doe' })

      await expect(friendRequestService.create(createFriendRequestBodyMock)).rejects.toThrow(
        new NotFoundException('SenderId not found'),
      )

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: createFriendRequestBodyMock.senderId },
      })

      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1)
    })

    it('should not be able to create a friend request if receiverId is not found', async () => {
      prismaService.friendRequest.findFirst = jest.fn().mockResolvedValue(null)

      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValueOnce({ id: 1, name: 'Jhon Doe' })
        .mockResolvedValueOnce(null)

      await expect(friendRequestService.create(createFriendRequestBodyMock)).rejects.toThrow(
        new NotFoundException('ReceiverId not found'),
      )

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: createFriendRequestBodyMock.receiverId },
      })

      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(2)
    })

    it('should throw an exception', async () => {
      prismaService.friendRequest.findFirst = jest.fn().mockResolvedValue(null)
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValueOnce(user1Mock)
        .mockResolvedValueOnce(user2Mock)

      jest
        .spyOn(prismaService.friendRequest, 'create')
        .mockRejectedValueOnce(new Error('Simulated error'))

      expect(friendRequestService.create(createFriendRequestBodyMock)).rejects.toThrowError()
    })
  })

  describe('findAllPending', () => {
    it('should return all pending friend requests for a given user', async () => {
      const userId = 1

      const pendingRequestsMock = [
        {
          id: 101,
          createdAt: new Date(),
          status: 'PENDING',
          sender: {
            id: 2,
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
        {
          id: 122,
          createdAt: new Date(),
          status: 'PENDING',
          sender: {
            id: 3,
            name: 'Ana Doe',
            email: 'ana.doe@example.com',
          },
        },
      ]

      prismaService.friendRequest.findMany = jest.fn().mockResolvedValue(pendingRequestsMock)

      const result = await friendRequestService.findAllPending(userId)

      expect(prismaService.friendRequest.findMany).toHaveBeenCalledWith({
        where: {
          receiverId: userId,
          AND: {
            status: 'PENDING',
          },
        },
        select: {
          id: true,
          createdAt: true,
          status: true,
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      expect(result).toHaveProperty('data')
      expect(result.data).toHaveLength(2)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(Date),
          status: 'PENDING',
          sender: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
          }),
        }),
      )
    })
  })

  describe('accept', () => {
    it('should be able to accept a pending friend request', async () => {
      prismaService.friendRequest.findUnique = jest.fn().mockResolvedValue(friendRequestPendingMock)
      prismaService.friendship.create = jest.fn().mockResolvedValue({})
      prismaService.friendRequest.delete = jest.fn().mockResolvedValue({})
      prismaService.$transaction = jest.fn().mockImplementation(async (callback) => {
        await callback(prismaService)
      })

      await friendRequestService.accept(friendRequestPendingMock.id)

      expect(prismaService.friendRequest.findUnique).toHaveBeenCalledWith({
        where: { id: friendRequestPendingMock.id },
        select: { receiverId: true, senderId: true, id: true },
      })

      expect(prismaService.friendship.create).toHaveBeenCalledWith({
        data: {
          userIdInitiated: friendRequestPendingMock.senderId,
          userIdReceived: friendRequestPendingMock.receiverId,
        },
      })

      expect(prismaService.friendRequest.delete).toHaveBeenCalledWith({
        where: { id: friendRequestPendingMock.id },
      })
    })

    it('should throw an error if friend request is not found', async () => {
      const friendRequestId = 1

      prismaService.friendRequest.findUnique = jest.fn().mockResolvedValue(null)

      await expect(friendRequestService.accept(friendRequestId)).rejects.toThrow(
        new NotFoundException('FriendRequest not found'),
      )

      expect(prismaService.friendRequest.findUnique).toHaveBeenCalledWith({
        where: { id: friendRequestId },
        select: { receiverId: true, senderId: true, id: true },
      })
    })
  })

  describe('reject', () => {
    it('should be able to reject a friend request', async () => {
      prismaService.friendRequest.findUnique = jest.fn().mockResolvedValue(friendRequestPendingMock)
      prismaService.friendRequest.delete = jest.fn().mockResolvedValue({})

      await friendRequestService.reject(friendRequestPendingMock.id)

      expect(prismaService.friendRequest.findUnique).toHaveBeenCalledWith({
        where: { id: friendRequestPendingMock.id },
      })

      expect(prismaService.friendRequest.delete).toHaveBeenCalledWith({
        where: { id: friendRequestPendingMock.id },
      })
    })

    it('should throw an error if friend request is not found', async () => {
      const friendRequestId = 1

      prismaService.friendRequest.findUnique = jest.fn().mockResolvedValue(null)

      await expect(friendRequestService.accept(friendRequestId)).rejects.toThrow(
        new NotFoundException('FriendRequest not found'),
      )
    })
  })
})
