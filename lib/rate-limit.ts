import { env } from "@/lib/env";

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

const memoryStore = new Map<string, { count: number; reset: number }>();

export async function rateLimit(
  key: string,
  limit = 30,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const reset = Math.floor(Date.now() / 1000) + windowSeconds;

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const redisKey = `rate:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
    const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, windowSeconds],
      ]),
      cache: "no-store",
    });

    if (response.ok) {
      const payload = (await response.json()) as [{ result: number }];
      const count = payload[0]?.result ?? limit + 1;
      return {
        success: count <= limit,
        remaining: Math.max(0, limit - count),
        reset,
      };
    }
  }

  const current = memoryStore.get(key);
  if (!current || current.reset < Date.now()) {
    memoryStore.set(key, { count: 1, reset: Date.now() + windowSeconds * 1000 });
    return { success: true, remaining: limit - 1, reset };
  }

  current.count += 1;
  return {
    success: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    reset: Math.floor(current.reset / 1000),
  };
}
