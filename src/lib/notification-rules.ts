/**
 * Pure helpers for notification and client-status rules. Used by API routes and tests.
 */

export type ClientStatus = "good" | "warning" | "exceeded"

/**
 * Status for a client's hours this month based on percent used.
 */
export function clientStatusFromPercent(percentUsed: number): ClientStatus {
  if (percentUsed >= 100) return "exceeded"
  if (percentUsed >= 80) return "warning"
  return "good"
}

/**
 * Whether we should create an 80% notification (used >= 80% and < 100%).
 */
export function shouldNotifyHours80(used: number, cap: number): boolean {
  if (cap <= 0) return false
  const pct = (used / cap) * 100
  return pct >= 80 && pct < 100
}

/**
 * Whether we should create a 100% notification (used >= 100%).
 */
export function shouldNotifyHours100(used: number, cap: number): boolean {
  if (cap <= 0) return false
  const pct = (used / cap) * 100
  return pct >= 100
}

/**
 * Percent used (0-100+), rounded.
 */
export function percentUsed(used: number, cap: number): number {
  if (cap <= 0) return 0
  return Math.round((used / cap) * 100)
}
