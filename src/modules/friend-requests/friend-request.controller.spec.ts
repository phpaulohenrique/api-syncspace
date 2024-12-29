import { Test, TestingModule } from '@nestjs/testing'
import { FriendRequestsController } from './friend-request.controller'
import { FriendRequestsService } from './friend-request.service'

describe('FriendRequestController', () => {
  let controller: FriendRequestsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestsController],
      providers: [FriendRequestsService],
    }).compile()

    controller = module.get<FriendRequestsService>(FriendRequestsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
