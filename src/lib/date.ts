import { CONFIG } from '../config';

/** 한국시간 기준 'YYYY-MM-DD' 의 자정 (UTC ms) */
const kstDayStart = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) - 9 * 3600e3;

export function eventParts() {
  const [y, m, d] = CONFIG.event.date.split('-').map(Number);
  return { y, m, d };
}

/** D-day 숫자: 양수 = 남은 날, 0 = 당일, 음수 = 지남 */
export function daysUntilEvent(now = Date.now()): number {
  const { y, m, d } = eventParts();
  const kstNow = new Date(now + 9 * 3600e3);
  const today = kstDayStart(kstNow.getUTCFullYear(), kstNow.getUTCMonth() + 1, kstNow.getUTCDate());
  return Math.round((kstDayStart(y, m, d) - today) / 86400e3);
}
