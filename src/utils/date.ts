import type { Locale } from 'date-fns';
import {
  startOfWeek,
  endOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  format,
} from 'date-fns';
import type { CalendarView } from '../types/view.ts';
import type { TimeRange, WeekStartsOn } from '../types/datetime.ts';
import { DEFAULT_WEEK_STARTS_ON, DEFAULT_N_DAYS, DEFAULT_AGENDA_LENGTH } from './constants.ts';

export function getOrderedWeekdayLabels<T>(labels: T[], weekStartsOn: WeekStartsOn): T[] {
  return Array.from({ length: 7 }, (_, i) => labels[(weekStartsOn + i) % 7]);
}

export function getWeekdayLabels(
  weekStartsOn: WeekStartsOn,
  width: 'narrow' | 'short',
  locale?: Locale,
): string[] {
  const base = startOfWeek(new Date(2021, 7, 1), { weekStartsOn });
  const pattern = width === 'narrow' ? 'EEEEE' : 'EEE';
  const formatOpts = locale ? { locale } : undefined;
  return Array.from({ length: 7 }, (_, i) => format(addDays(base, i), pattern, formatOpts));
}

export function getVisibleDaysForWeek(date: Date, weekStartsOn: WeekStartsOn): Date[] {
  const start = startOfWeek(date, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getVisibleDaysForMonth(date: Date, weekStartsOn: WeekStartsOn): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function getMonthsForYear(year: number): Date[] {
  return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
}

export function getDaysForRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

interface FormatDateLabelOptions {
  weekStartsOn?: WeekStartsOn;
  nDays?: number;
  locale?: Locale;
}

export function formatDateLabel(
  date: Date,
  view: CalendarView,
  opts?: FormatDateLabelOptions,
): string {
  const locale = opts?.locale;
  const formatOpts = locale ? { locale } : undefined;
  const weekStartsOn = opts?.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;

  const formatRange = (start: Date, end: Date): string => {
    const sameMonth =
      start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      const monthAbbr = format(start, 'MMM', formatOpts);
      const startDay = format(start, 'd', formatOpts);
      const endDay = format(end, 'd', formatOpts);
      const year = format(end, 'yyyy', formatOpts);
      return `${monthAbbr} ${startDay} \u2013 ${endDay}, ${year}`;
    }

    const startLabel = format(start, 'MMM d', formatOpts);
    const endLabel = format(end, 'MMM d', formatOpts);
    const year = format(end, 'yyyy', formatOpts);
    return `${startLabel} \u2013 ${endLabel}, ${year}`;
  };

  switch (view) {
    case 'day':
      return format(date, 'EEEE, MMMM d, yyyy', formatOpts);

    case 'week':
      return formatRange(
        startOfWeek(date, { weekStartsOn }),
        endOfWeek(date, { weekStartsOn }),
      );

    case 'n-days': {
      const nDays = opts?.nDays ?? DEFAULT_N_DAYS;
      return formatRange(date, addDays(date, nDays - 1));
    }

    case 'month':
    case 'agenda':
      return format(date, 'MMMM yyyy', formatOpts);

    case 'year':
      return format(date, 'yyyy', formatOpts);
  }
}

export function getVisibleRange(
  date: Date,
  view: CalendarView,
  opts: { weekStartsOn: WeekStartsOn; nDays?: number; agendaLength?: number },
): TimeRange {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) };

    case 'week':
      return {
        start: startOfDay(startOfWeek(date, { weekStartsOn: opts.weekStartsOn })),
        end: endOfDay(endOfWeek(date, { weekStartsOn: opts.weekStartsOn })),
      };

    case 'n-days': {
      const nDays = opts.nDays ?? DEFAULT_N_DAYS;
      return {
        start: startOfDay(date),
        end: endOfDay(addDays(date, nDays - 1)),
      };
    }

    case 'month': {
      const days = getVisibleDaysForMonth(date, opts.weekStartsOn);
      return {
        start: startOfDay(days[0]),
        end: endOfDay(days[days.length - 1]),
      };
    }

    case 'year':
      return {
        start: startOfYear(date),
        end: endOfYear(date),
      };

    case 'agenda': {
      const agendaLength = opts.agendaLength ?? DEFAULT_AGENDA_LENGTH;
      return {
        start: startOfDay(date),
        end: endOfDay(addDays(date, agendaLength - 1)),
      };
    }
  }
}
