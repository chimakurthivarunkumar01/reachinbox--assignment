import { redis } from '../config/redis';

export async function checkRateLimit(userId: string, maxEmailsPerHour: number): Promise<{ allowed: boolean; nextAvailableTime?: Date }> {
  const now = Date.now();
  const currentHour = Math.floor(now / (60 * 60 * 1000));
  const key = `rate_limit:sender:${userId}:${currentHour}`;
  
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 3600); // Expire after 1 hour
  }
  
  if (count <= maxEmailsPerHour) {
    return { allowed: true };
  }
  
  // Calculate next available time (next hour)
  const nextHour = (currentHour + 1) * 60 * 60 * 1000;
  return {
    allowed: false,
    nextAvailableTime: new Date(nextHour),
  };
}
