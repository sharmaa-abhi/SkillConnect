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
 * Parses an ISO string, YYYY-MM-DD string, or Date object into a valid Date.
 */
export function parseDateSafe(input: Date | string | number): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return new Date();
    return input;
  }

  if (typeof input === 'string') {
    // Check if it's already a full date or relative string like "Oct 13, 2026"
    const parsed = new Date(input);
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
    d.setDate(base.getDate() + i);

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
