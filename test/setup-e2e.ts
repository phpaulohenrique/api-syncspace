import { config } from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
// import { DomainEvents } from '@/core/events/domain-events'
import { Redis } from 'ioredis'
// import { envSchema } from '@/infra/env/env'

// config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

// const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
/* const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
}) */
function generateUniqueDatabaseURL(schemaId: string): string {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL

  console.log('DATABASE_URL', process.env.DATABASE_URL)

  // await redis.flushdb()
  execSync('npx prisma migrate deploy', { env: process.env })
})

afterEach(async () => {
  const tables = await prisma.$queryRaw<{ table_name: string }[]>`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = ${schemaId}
  ORDER BY table_name;
`
  const tableNames = tables.map((table) => table.table_name)
  const truncateCommand = `TRUNCATE TABLE ${tableNames.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE`

  await prisma.$executeRawUnsafe(truncateCommand)
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
