/**
 * Centralized Date & Timezone utilities for SkillConnect.
 * Ensures consistent weekday derivation and calendar math across all views.
 */

export const DEFAULT_MARKET_TIMEZONE = 'America/Los_Angeles';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type WeekdayName = (typeof WEEKDAYS)[number];

/**
 * Parses an ISO string, YYYY-MM-DD string, month-day string, or Date object into a valid Date.
 * Date-only strings are anchored at 12:00 UTC to prevent timezone offsets from shifting calendar days.
 */
export function parseDateSafe(input: Date | string | number): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return new Date();
    return input;
  }

  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? new Date() : d;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();

    // 1. Check YYYY-MM-DD or YYYY/MM/DD
    const matchYMD = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (matchYMD) {
      return new Date(
        Date.UTC(parseInt(matchYMD[1], 10), parseInt(matchYMD[2], 10) - 1, parseInt(matchYMD[3], 10), 12, 0, 0)
      );
    }

    // 2. Check "Month Day, Year" or "Month Day" (e.g., "October 13, 2026" or "Oct 13")
    const matchMDY = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?$/);
    if (matchMDY) {
      const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      const monthPrefix = matchMDY[1].toLowerCase().slice(0, 3);
      const mIdx = monthNames.findIndex((m) => m.startsWith(monthPrefix));
      const yr = matchMDY[3] ? parseInt(matchMDY[3], 10) : new Date().getFullYear();
      if (mIdx !== -1) {
        return new Date(Date.UTC(yr, mIdx, parseInt(matchMDY[2], 10), 12, 0, 0));
      }
    }

    // 3. Fallback standard parse for ISO 8601 timestamps
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

/**
 * Returns the correct full weekday name (e.g., 'Tuesday') for a given date in the target timezone.
 * Eliminates hardcoded weekday mismatches (e.g., Oct 13, 2026 is Tuesday, NOT Wednesday).
 */
export function getWeekdayName(
  date: Date | string | number,
  timeZone: string = DEFAULT_MARKET_TIMEZONE
): WeekdayName {
  const d = parseDateSafe(date);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone,
  });
  return formatter.format(d) as WeekdayName;
}

/**
 * Formats a date to standard display format, e.g., "Tuesday, Oct 13" or "Oct 13, 2026".
 */
export function formatDateDisplay(
  date: Date | string | number,
  options: {
    includeWeekday?: boolean;
    includeYear?: boolean;
    timeZone?: string;
  } = {}
): string {
  const d = parseDateSafe(date);
  const {
    includeWeekday = true,
    includeYear = false,
    timeZone = DEFAULT_MARKET_TIMEZONE,
  } = options;

  const weekday = getWeekdayName(d, timeZone);
  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone,
  });
  const monthDay = monthFormatter.format(d);

  const yearFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone,
  });
  const year = yearFormatter.format(d);

  if (includeWeekday && includeYear) {
    return `${weekday}, ${monthDay}, ${year}`;
  }
  if (includeWeekday) {
    return `${weekday}, ${monthDay}`;
  }
  if (includeYear) {
    return `${monthDay}, ${year}`;
  }
  return monthDay;
}

export interface BookingDateOption {
  label: string; // 'Today', 'Tomorrow', or Weekday name
  subtext: string; // 'Oct 13'
  value: string; // 'Tuesday, Oct 13'
  isoDate: string; // '2026-10-13'
  weekday: WeekdayName;
  available: boolean;
}

/**
 * Generates dynamic, strictly calculated booking dates starting from a base reference date.
 * Guarantees every label and weekday matches the actual calendar date.
 */
export function generateBookingDateOptions(
  baseDateInput?: Date | string,
  daysCount: number = 5,
  availableToday: boolean = true,
  timeZone: string = DEFAULT_MARKET_TIMEZONE
): BookingDateOption[] {
  const base = baseDateInput ? parseDateSafe(baseDateInput) : new Date();
  const options: BookingDateOption[] = [];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(base.getTime());
    d.setUTCDate(base.getUTCDate() + i);

    const weekday = getWeekdayName(d, timeZone);
    const monthFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone,
    });
    const subtext = monthFormatter.format(d);

    const yearFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      timeZone,
    });
    const year = yearFormatter.format(d);

    // ISO format YYYY-MM-DD
    const isoParts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone,
    }).format(d);

    let label: string;
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else {
      label = weekday;
    }

    const value = `${label === 'Today' || label === 'Tomorrow' ? `${label}, ` : `${weekday}, `}${subtext}`;

    options.push({
      label,
      subtext,
      value,
      isoDate: isoParts,
      weekday,
      available: i === 0 ? availableToday : true,
    });
  }

  return options;
}
