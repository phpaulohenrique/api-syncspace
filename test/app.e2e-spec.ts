import * as request from 'supertest'

import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserDto } from '@/modules/users/dto/create-user.dto'
import { createUserE2EHelper } from './helpers'

const createUser1Mock: CreateUserDto = {
  name: 'User 1',
  email: 'user1@example.com',
  password: 'password123',
}

const createUser2Mock: CreateUserDto = {
  name: 'User 2',
  email: 'user2@example.com',
  password: 'password123',
}

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })

  describe('FriendRequestController', () => {
    it('should create successfully (POST)', async () => {
      const respUser1 = await createUserE2EHelper(app, createUser1Mock)
      const respUser2 = await createUserE2EHelper(app, createUser2Mock)

      const response = await request(app.getHttpServer())
        .post('/friend-requests')
        .send({ senderId: respUser1.body.id, receiverId: respUser2.body.id })
        .expect(201)

      expect(response.body.data).toHaveProperty('id')
    })

    it('should not allow a user to send a friend request to themselves (POST)', async () => {
      const respUser1 = await createUserE2EHelper(app, createUser1Mock)

      const response = await request(app.getHttpServer())
        .post('/friend-requests')
        .send({ senderId: respUser1.body.id, receiverId: respUser1.body.id })
        .expect(400)

      expect(response.body.message).toBe('User cannot send a friend request to yourself')
    })

    it('should return error if sender does not exist (POST)', async () => {
      const respUser2 = await createUserE2EHelper(app, createUser2Mock)

      const response = await request(app.getHttpServer())
        .post('/friend-requests')
        .send({ senderId: 99999, receiverId: respUser2.body.id })
        .expect(404)

      expect(response.body.message).toBe('SenderId not found')
    })

    it('should return all friend requests (GET)', async () => {
      const respUser1 = await createUserE2EHelper(app, createUser1Mock)
      const respUser2 = await createUserE2EHelper(app, createUser2Mock)

      await request(app.getHttpServer())
        .post('/friend-requests')
        .send({ senderId: respUser1.body.id, receiverId: respUser2.body.id })
        .expect(201)

      const response = await request(app.getHttpServer())
        .get(`/friend-requests/pending/${respUser2.body.id}`)
        .expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toHaveProperty('id')
    })

    it('accept a friend request (PATCH)', async () => {
      const respUser1 = await createUserE2EHelper(app, createUser1Mock)
      const respUser2 = await createUserE2EHelper(app, createUser2Mock)

      const friendRequestResp = await request(app.getHttpServer())
        .post('/friend-requests')
        .send({ senderId: respUser1.body.id, receiverId: respUser2.body.id })
        .expect(201)

      const friendRequestId = friendRequestResp.body.data.id

      await request(app.getHttpServer())
        .patch(`/friend-requests/accept/${friendRequestId}`)
        .expect(200)
    })

    it('reject a friend request (PATCH)', async () => {
      const respUser1 = await createUserE2EHelper(app, createUser1Mock)
      const respUser2 = await createUserE2EHelper(app, createUser2Mock)

      const friendRequestResp = await request(app.getHttpServer())
        .post('/friend-requests')
        .send({ senderId: respUser1.body.id, receiverId: respUser2.body.id })
        .expect(201)

      const friendRequestId = friendRequestResp.body.data.id

      await request(app.getHttpServer())
        .patch(`/friend-requests/reject/${friendRequestId}`)
        .expect(200)
    })
  })
})
