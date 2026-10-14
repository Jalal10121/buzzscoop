/**
 * Brute force protection — locks account after N failed attempts
 */

interface LoginAttempt {
  count: number;
  lockedUntil: number;
  lastAttempt: number;
}

const attempts = new Map<string, LoginAttempt>();

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 min
const ATTEMPT_WINDOW_MS = 30 * 60 * 1000; // 30 min

export function checkBruteForce(identifier: string): {
  locked: boolean;
  attemptsLeft: number;
  unlockIn: number;
} {
  const now = Date.now();
  const entry = attempts.get(identifier);

  if (!entry) {
    return { locked: false, attemptsLeft: MAX_ATTEMPTS, unlockIn: 0 };
  }

  // Lock expired
  if (entry.lockedUntil && entry.lockedUntil < now) {
    attempts.delete(identifier);
    return { locked: false, attemptsLeft: MAX_ATTEMPTS, unlockIn: 0 };
  }

  // Still locked
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      locked: true,
      attemptsLeft: 0,
      unlockIn: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }

  // Old attempts reset
  if (entry.lastAttempt < now - ATTEMPT_WINDOW_MS) {
    attempts.delete(identifier);
    return { locked: false, attemptsLeft: MAX_ATTEMPTS, unlockIn: 0 };
  }

  return {
    locked: false,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - entry.count),
    unlockIn: 0,
  };
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = attempts.get(identifier) || {
    count: 0,
    lockedUntil: 0,
    lastAttempt: now,
  };

  entry.count++;
  entry.lastAttempt = now;

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCK_DURATION_MS;
  }

  attempts.set(identifier, entry);
}

export function recordSuccess(identifier: string): void {
  attempts.delete(identifier);
}