import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { OnEvent } from '@nestjs/event-emitter'
import { RedisService } from '@liaoliaots/nestjs-redis'

// import { LogEvent } from './log.event'

export class LogEvent {
  constructor(
    public readonly key: string,
    public readonly message: string,
  ) {}
}

@Injectable()
export class LogService implements OnModuleInit {
  private readonly redis: Redis | null

  // constructor(@InjectRedis() private readonly redis: Redis) {}

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow()
  }

  onModuleInit() {
    console.log('LogService initialized')
  }

  @OnEvent('log.created')
  async handleLogEvent(event: LogEvent): Promise<void> {
    const timestamp = new Date().toISOString()
    await this.redis.lpush(event.key, `${timestamp}-${event.message}`)
  }

  async getLogs(key: string, count = 10): Promise<string[]> {
    return await this.redis.lrange(key, 0, count - 1)
  }
}
