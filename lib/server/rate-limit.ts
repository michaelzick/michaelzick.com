type RateLimitEntry = {
  count: number;
  lastReset: number;
};

type ConsumeRateLimitOptions = {
  key: string;
  store: Map<string, RateLimitEntry>;
  now?: number;
  windowMs: number;
  maxRequests: number;
};

export function consumeRateLimit({
  key,
  store,
  now = Date.now(),
  windowMs,
  maxRequests,
}: ConsumeRateLimitOptions) {
  const entry = store.get(key) || { count: 0, lastReset: now };

  if (now - entry.lastReset > windowMs) {
    entry.count = 0;
    entry.lastReset = now;
  }

  if (entry.count >= maxRequests) {
    const retryAfterMs = Math.max(0, windowMs - (now - entry.lastReset));

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
    };
  }

  entry.count += 1;
  store.set(key, entry);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - entry.count),
    retryAfterMs: 0,
  };
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'anonymous';
}
