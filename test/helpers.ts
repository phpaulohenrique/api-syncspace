import { CreateUserDto } from '@/modules/users/dto/create-user.dto'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

export async function createUserE2EHelper(app: INestApplication, payload: CreateUserDto) {
  return request(app.getHttpServer()).post('/users').send(payload).expect(201)
}
