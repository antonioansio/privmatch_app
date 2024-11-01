import { Redis } from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not defined');
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error('REDIS_PASSWORD environment variable is not defined');
}

export const redis =
  globalThis.redis ||
  new Redis(process.env.REDIS_URL!, {
    password: process.env.REDIS_PASSWORD!,
  });

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis;
