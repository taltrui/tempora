import { describe, it, expect } from 'vitest';
import {
  getVisibleDaysForWeek,
  getVisibleDaysForMonth,
  getMonthsForYear,
  getDaysForRange,
  formatDateLabel,
  getVisibleRange,
  getOrderedWeekdayLabels,
} from './date.ts';

describe('getOrderedWeekdayLabels', () => {
  const LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  it('returns labels starting from Sunday when weekStartsOn=0', () => {
    expect(getOrderedWeekdayLabels(LABELS, 0)).toEqual(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
  });

  it('returns labels starting from Monday when weekStartsOn=1', () => {
    expect(getOrderedWeekdayLabels(LABELS, 1)).toEqual(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
  });

  it('returns labels starting from Saturday when weekStartsOn=6', () => {
    expect(getOrderedWeekdayLabels(LABELS, 6)).toEqual(['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI']);
  });

  it('works with single-letter labels', () => {
    const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    expect(getOrderedWeekdayLabels(letters, 1)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });
});

describe('getVisibleDaysForWeek', () => {
  it('returns 7 days starting from Sunday when weekStartsOn=0', () => {
    const date = new Date(2026, 1, 11);
    const days = getVisibleDaysForWeek(date, 0);

    expect(days).toHaveLength(7);
    expect(days[0]).toEqual(new Date(2026, 1, 8));
    expect(days[6]).toEqual(new Date(2026, 1, 14));
  });

  it('returns 7 days starting from Monday when weekStartsOn=1', () => {
    const date = new Date(2026, 1, 11);
    const days = getVisibleDaysForWeek(date, 1);

    expect(days).toHaveLength(7);
    expect(days[0]).toEqual(new Date(2026, 1, 9));
    expect(days[6]).toEqual(new Date(2026, 1, 15));
  });

  it('handles edge of month correctly', () => {
    const date = new Date(2026, 0, 31);
    const days = getVisibleDaysForWeek(date, 0);

    expect(days).toHaveLength(7);
    expect(days[0]).toEqual(new Date(2026, 0, 25));
    expect(days[6]).toEqual(new Date(2026, 0, 31));
  });
});

describe('getVisibleDaysForMonth', () => {
  it('returns 28 days for Feb 2026 with weekStartsOn=0 (starts on Sunday)', () => {
    const date = new Date(2026, 1, 1);
    const days = getVisibleDaysForMonth(date, 0);

    expect(days).toHaveLength(28);
    expect(days[0]).toEqual(new Date(2026, 1, 1));
    expect(days[days.length - 1]).toEqual(new Date(2026, 1, 28));
  });

  it('returns 35 days for March 2026 with weekStartsOn=0', () => {
    const date = new Date(2026, 2, 1);
    const days = getVisibleDaysForMonth(date, 0);

    expect(days).toHaveLength(35);
    expect(days[0]).toEqual(new Date(2026, 2, 1));
    expect(days[days.length - 1]).toEqual(new Date(2026, 3, 4));
  });

  it('returns 42 days for May 2026 with weekStartsOn=0 (6 weeks)', () => {
    const date = new Date(2026, 4, 1);
    const days = getVisibleDaysForMonth(date, 0);

    expect(days).toHaveLength(42);
    expect(days[0]).toEqual(new Date(2026, 3, 26));
    expect(days[days.length - 1]).toEqual(new Date(2026, 5, 6));
  });

  it('returns 35 days for Feb 2026 with weekStartsOn=1 (Monday start)', () => {
    const date = new Date(2026, 1, 1);
    const days = getVisibleDaysForMonth(date, 1);

    expect(days).toHaveLength(35);
    expect(days[0]).toEqual(new Date(2026, 0, 26));
    expect(days[days.length - 1]).toEqual(new Date(2026, 2, 1));
  });
});

describe('getMonthsForYear', () => {
  it('returns 12 dates for a year', () => {
    const months = getMonthsForYear(2026);

    expect(months).toHaveLength(12);
  });

  it('returns first of each month', () => {
    const months = getMonthsForYear(2026);

    months.forEach((month, index) => {
      expect(month.getFullYear()).toBe(2026);
      expect(month.getMonth()).toBe(index);
      expect(month.getDate()).toBe(1);
    });
  });
});

describe('getDaysForRange', () => {
  it('returns correct number of days for a range', () => {
    const days = getDaysForRange(new Date(2026, 1, 1), new Date(2026, 1, 5));

    expect(days).toHaveLength(5);
    expect(days[0]).toEqual(new Date(2026, 1, 1));
    expect(days[4]).toEqual(new Date(2026, 1, 5));
  });

  it('returns single day when start equals end', () => {
    const days = getDaysForRange(new Date(2026, 1, 1), new Date(2026, 1, 1));

    expect(days).toHaveLength(1);
    expect(days[0]).toEqual(new Date(2026, 1, 1));
  });
});

describe('formatDateLabel', () => {
  it('formats day view label', () => {
    const date = new Date(2026, 1, 11);
    expect(formatDateLabel(date, 'day')).toBe('Wednesday, February 11, 2026');
  });

  it('formats week view label within same month', () => {
    const date = new Date(2026, 1, 11);
    expect(formatDateLabel(date, 'week')).toBe('Feb 8 – 14, 2026');
  });

  it('formats week view label crossing months with Monday start', () => {
    const date = new Date(2026, 0, 28);
    expect(formatDateLabel(date, 'week')).toBe('Jan 25 – 31, 2026');
  });

  it('formats week view label crossing months', () => {
    const date = new Date(2026, 0, 29);
    expect(formatDateLabel(date, 'week')).toBe('Jan 25 – 31, 2026');
  });

  it('formats n-days view same as week', () => {
    const date = new Date(2026, 1, 11);
    expect(formatDateLabel(date, 'n-days')).toBe('Feb 8 – 14, 2026');
  });

  it('formats month view label', () => {
    const date = new Date(2026, 1, 11);
    expect(formatDateLabel(date, 'month')).toBe('February 2026');
  });

  it('formats year view label', () => {
    const date = new Date(2026, 1, 11);
    expect(formatDateLabel(date, 'year')).toBe('2026');
  });

  it('formats agenda view same as month', () => {
    const date = new Date(2026, 1, 11);
    expect(formatDateLabel(date, 'agenda')).toBe('February 2026');
  });

  it('formats week view crossing months with different start/end months', () => {
    const date = new Date(2026, 1, 1);
    expect(formatDateLabel(date, 'week')).toBe('Feb 1 – 7, 2026');
  });
});

describe('getVisibleRange', () => {
  it('returns start and end of day for day view', () => {
    const date = new Date(2026, 1, 11, 10, 30);
    const range = getVisibleRange(date, 'day', { weekStartsOn: 0 });

    expect(range.start).toEqual(new Date(2026, 1, 11, 0, 0, 0, 0));
    expect(range.end.getFullYear()).toBe(2026);
    expect(range.end.getMonth()).toBe(1);
    expect(range.end.getDate()).toBe(11);
    expect(range.end.getHours()).toBe(23);
    expect(range.end.getMinutes()).toBe(59);
    expect(range.end.getSeconds()).toBe(59);
  });

  it('returns week range for week view', () => {
    const date = new Date(2026, 1, 11);
    const range = getVisibleRange(date, 'week', { weekStartsOn: 0 });

    expect(range.start).toEqual(new Date(2026, 1, 8, 0, 0, 0, 0));
    expect(range.end.getDate()).toBe(14);
    expect(range.end.getHours()).toBe(23);
    expect(range.end.getMinutes()).toBe(59);
  });

  it('returns month range matching getVisibleDaysForMonth', () => {
    const date = new Date(2026, 1, 11);
    const range = getVisibleRange(date, 'month', { weekStartsOn: 0 });

    expect(range.start).toEqual(new Date(2026, 1, 1, 0, 0, 0, 0));
    expect(range.end.getMonth()).toBe(1);
    expect(range.end.getDate()).toBe(28);
  });

  it('returns year range for year view', () => {
    const date = new Date(2026, 5, 15);
    const range = getVisibleRange(date, 'year', { weekStartsOn: 0 });

    expect(range.start).toEqual(new Date(2026, 0, 1, 0, 0, 0, 0));
    expect(range.end.getFullYear()).toBe(2026);
    expect(range.end.getMonth()).toBe(11);
    expect(range.end.getDate()).toBe(31);
    expect(range.end.getHours()).toBe(23);
    expect(range.end.getMinutes()).toBe(59);
  });

  it('returns n-days range with default nDays=4', () => {
    const date = new Date(2026, 1, 11);
    const range = getVisibleRange(date, 'n-days', { weekStartsOn: 0 });

    expect(range.start).toEqual(new Date(2026, 1, 11, 0, 0, 0, 0));
    expect(range.end.getDate()).toBe(14);
    expect(range.end.getHours()).toBe(23);
    expect(range.end.getMinutes()).toBe(59);
  });

  it('returns n-days range with custom nDays', () => {
    const date = new Date(2026, 1, 11);
    const range = getVisibleRange(date, 'n-days', { weekStartsOn: 0, nDays: 3 });

    expect(range.start).toEqual(new Date(2026, 1, 11, 0, 0, 0, 0));
    expect(range.end.getDate()).toBe(13);
  });

  it('returns agenda range with default length=30', () => {
    const date = new Date(2026, 1, 11);
    const range = getVisibleRange(date, 'agenda', { weekStartsOn: 0 });

    expect(range.start).toEqual(new Date(2026, 1, 11, 0, 0, 0, 0));
    expect(range.end.getMonth()).toBe(2);
    expect(range.end.getDate()).toBe(12);
  });

  it('returns agenda range with custom length', () => {
    const date = new Date(2026, 1, 11);
    const range = getVisibleRange(date, 'agenda', { weekStartsOn: 0, agendaLength: 7 });

    expect(range.start).toEqual(new Date(2026, 1, 11, 0, 0, 0, 0));
    expect(range.end.getDate()).toBe(17);
    expect(range.end.getMonth()).toBe(1);
  });
});
