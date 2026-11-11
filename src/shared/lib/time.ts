import {
  differenceInCalendarDays,
  format,
  isThisYear,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns'

// Timestamps arrive as ISO strings in two spellings (REST and live events), so always parse, never compare as text.
export function formatListTimestamp(iso: string): string {
  const date = parseISO(iso)
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return 'Yesterday'
  if (differenceInCalendarDays(new Date(), date) < 7) return format(date, 'EEEE')
  return isThisYear(date) ? format(date, 'd MMM') : format(date, 'd MMM yyyy')
}
