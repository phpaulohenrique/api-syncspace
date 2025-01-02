import { Test, TestingModule } from '@nestjs/testing'
import { FriendRequestsController } from './friend-request.controller'
import { FriendRequestsService } from './friend-request.service'
import { createMock } from '@golevelup/ts-jest'
import { CreateFriendRequestDto } from './dto/create-friend-request.dto'

const createFriendRequestDto: CreateFriendRequestDto = {
  senderId: 1,
  receiverId: 2,
}

const friendRequestPendingMockList = [
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

describe('FriendRequestController', () => {
  let friendRequestsController: FriendRequestsController
  let friendRequestsService: FriendRequestsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestsController],
      providers: [
        { provide: FriendRequestsService, useValue: createMock<FriendRequestsService>() },
      ],
    }).compile()

    friendRequestsController = module.get<FriendRequestsController>(FriendRequestsController)
    friendRequestsService = module.get<FriendRequestsService>(FriendRequestsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(friendRequestsService).toBeDefined()
    expect(friendRequestsController).toBeDefined()
  })

  describe('create', () => {
    it('should be able to send a friend request successfully', async () => {
      const mockResponse = {
        data: {
          pendingRequests: [friendRequestPendingMockList[0]],
        },
      }

      friendRequestsService.create = jest.fn().mockResolvedValue(mockResponse)
      await friendRequestsController.create(createFriendRequestDto)

      expect(friendRequestsService.create).toHaveBeenCalledTimes(1)
      expect(friendRequestsService.create).toHaveBeenCalledWith(createFriendRequestDto)
    })

    it('should return the expected response format', async () => {
      const mockResponse = {
        data: {
          pendingRequests: [friendRequestPendingMockList[0]],
        },
      }
      friendRequestsService.create = jest.fn().mockResolvedValue(mockResponse)

      const result = await friendRequestsController.create(createFriendRequestDto)

      expect(result).toHaveProperty('data')
      expect(result.data).toHaveProperty('pendingRequests')
    })

    it('should handle errors when sending a friend request fails', async () => {
      const errorMessage = 'Failed to create friend request'
      friendRequestsService.create = jest.fn().mockRejectedValue(new Error(errorMessage))

      try {
        await friendRequestsController.create(createFriendRequestDto)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error?.message).toBe(errorMessage)
      }
    })
  })

  describe('findPending', () => {
    it('should return pending friend requests successfully', async () => {
      const mockResponse = {
        data: {
          pendingRequests: [
            {
              id: 1,
              createdAt: '2023-01-01T00:00:00Z',
              status: 'PENDING',
              sender: {
                id: 2,
                name: 'John Doe',
                email: 'johndoe@example.com',
              },
            },
          ],
        },
      }

      friendRequestsService.findAllPending = jest.fn().mockResolvedValueOnce(mockResponse)

      const result = await friendRequestsController.findPending('1321')
      expect(result).toEqual(mockResponse)
      expect(friendRequestsService.findAllPending).toHaveBeenCalledTimes(1)
      expect(friendRequestsService.findAllPending).toHaveBeenCalledWith(1321)
    })

    it('should throw an error when the service fails', () => {
      friendRequestsService.findAllPending = jest
        .fn()
        .mockRejectedValueOnce(new Error('Service failed'))

      expect(friendRequestsController.findPending('2')).rejects.toThrow('Service failed')
      expect(friendRequestsService.findAllPending).toHaveBeenCalledTimes(1)
      expect(friendRequestsService.findAllPending).toHaveBeenCalledWith(2)
    })
  })

  describe('accept', () => {
    it('should accept a friend request successfully', async () => {
      friendRequestsService.accept = jest.fn().mockResolvedValue(true)

      await friendRequestsController.accept('1234')
      expect(friendRequestsService.accept).toHaveBeenCalledTimes(1)
      expect(friendRequestsService.accept).toHaveBeenCalledWith(1234)
    })

    it('should throw an error when the service fails', () => {
      friendRequestsService.accept = jest.fn().mockRejectedValueOnce(new Error('Service failed'))

      expect(friendRequestsController.accept('5678')).rejects.toThrow('Service failed')
      expect(friendRequestsService.accept).toHaveBeenCalledTimes(1)
      expect(friendRequestsService.accept).toHaveBeenCalledWith(5678)
    })
  })

  describe('reject', () => {
    it('should reject a friend request successfully', async () => {
      friendRequestsService.reject = jest.fn().mockResolvedValue(true)

      await friendRequestsController.reject('9012')
      expect(friendRequestsService.reject).toHaveBeenCalledTimes(1)
      expect(friendRequestsService.reject).toHaveBeenCalledWith(9012)
    })
  })
})
