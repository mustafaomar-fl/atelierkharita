// In-memory login throttle, keyed by client IP. This holds up fine for a
// single-owner site on a single persistent Node process (the same deployment
// model the rest of the app already assumes for bookings.json) — it resets
// on restart and doesn't work across multiple server instances, but it's
// enough to stop a script from brute-forcing ADMIN_PASSWORD.

const WINDOW_MS = 15 * 60 * 1000; // failed attempts older than this don't count
const MAX_ATTEMPTS = 5; // attempts allowed within the window before locking out
const LOCKOUT_MS = 15 * 60 * 1000; // how long a locked-out IP has to wait

type Entry = { failures: number[]; lockedUntil?: number };

const attemptsByIp = new Map<string, Entry>();

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const entry = attemptsByIp.get(ip);
  if (!entry) return { allowed: true };

  const now = Date.now();
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = attemptsByIp.get(ip) ?? { failures: [] };

  entry.failures = entry.failures.filter((t) => now - t < WINDOW_MS);
  entry.failures.push(now);

  if (entry.failures.length >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    entry.failures = [];
  }

  attemptsByIp.set(ip, entry);
}

export function clearLoginAttempts(ip: string): void {
  attemptsByIp.delete(ip);
}
