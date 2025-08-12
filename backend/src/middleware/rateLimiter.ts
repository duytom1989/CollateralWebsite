import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

class RedisRateLimiter {
  private redis: Redis;
  private windowMs: number;
  private max: number;

  constructor(
    windowMs: number = 15 * 60 * 1000, // 15 minutes
    max: number = process.env.NODE_ENV === 'development' ? 10000 : 100 // 10000 for dev, 100 for production
  ) {
    this.windowMs = windowMs;
    this.max = max;
    
    // Initialize Redis connection
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const key = `rate_limit:${ip}`;
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Use Redis sorted set to track requests in time window
        const pipeline = this.redis.pipeline();
        
        // Remove expired entries
        pipeline.zremrangebyscore(key, 0, windowStart);
        
        // Add current request
        pipeline.zadd(key, now, `${now}-${Math.random()}`);
        
        // Count requests in window
        pipeline.zcard(key);
        
        // Set expiration
        pipeline.expire(key, Math.ceil(this.windowMs / 1000));
        
        const results = await pipeline.exec();
        
        if (!results) {
          throw new Error('Redis pipeline execution failed');
        }

        const count = results[2][1] as number;

        if (count > this.max) {
          const oldestEntry = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
          const resetTime = oldestEntry.length > 0 
            ? parseInt(oldestEntry[1]) + this.windowMs 
            : now + this.windowMs;

          res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.',
            retryAfter: Math.ceil((resetTime - now) / 1000),
          });
          return;
        }

        // Add rate limit headers
        res.set({
          'X-RateLimit-Limit': this.max.toString(),
          'X-RateLimit-Remaining': Math.max(0, this.max - count).toString(),
          'X-RateLimit-Reset': new Date(now + this.windowMs).toISOString(),
        });

        next();
      } catch (error) {
        console.error('Rate limiter error:', error);
        // If Redis fails, allow the request to continue
        next();
      }
    };
  }
}

// In-memory fallback for development when Redis is not available
class MemoryRateLimiter {
  private store: { [key: string]: { count: number; resetTime: number } } = {};
  private windowMs: number;
  private max: number;

  constructor(windowMs: number = 15 * 60 * 1000, max: number = process.env.NODE_ENV === 'development' ? 10000 : 100) {
    this.windowMs = windowMs;
    this.max = max;
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      
      // Clean up expired entries
      Object.keys(this.store).forEach(key => {
        if (this.store[key].resetTime < now) {
          delete this.store[key];
        }
      });

      // Initialize or get current count for this IP
      if (!this.store[ip] || this.store[ip].resetTime < now) {
        this.store[ip] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
      } else {
        this.store[ip].count++;
      }

      // Check if limit exceeded
      if (this.store[ip].count > this.max) {
        res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: Math.ceil((this.store[ip].resetTime - now) / 1000),
        });
        return;
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': this.max.toString(),
        'X-RateLimit-Remaining': Math.max(0, this.max - this.store[ip].count).toString(),
        'X-RateLimit-Reset': new Date(this.store[ip].resetTime).toISOString(),
      });

      next();
    };
  }
}

export const createRateLimiter = (windowMs?: number, max?: number) => {
  if (process.env.REDIS_URL) {
    return new RedisRateLimiter(windowMs, max);
  } else {
    return new MemoryRateLimiter(windowMs, max);
  }
};

// Export with default values
const defaultLimiter = createRateLimiter();
export const rateLimiter = defaultLimiter.middleware();
export default rateLimiter;