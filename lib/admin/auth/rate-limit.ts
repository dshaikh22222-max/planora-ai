// ─────────────────────────────────────────────────────────────
// IP-based Rate Limiter — Sliding window in-memory protection
// Protects authentication API routes against brute-force attacks.
// ─────────────────────────────────────────────────────────────

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitTracker>();

/** Clean up expired IP records every 10 minutes */
setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of rateLimitMap.entries()) {
    if (now > tracker.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export function checkIpRateLimit(
  ip: string,
  limit = 10,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const tracker = rateLimitMap.get(ip);

  if (!tracker || now > tracker.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (tracker.count >= limit) {
    const retryAfterSeconds = Math.ceil((tracker.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  tracker.count += 1;
  return { allowed: true, remaining: limit - tracker.count, retryAfterSeconds: 0 };
}
