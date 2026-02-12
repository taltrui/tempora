import { describe, it, expect } from 'vitest';
import {
  minutesFromMidnight,
  dateFromMinutes,
  snapToSlot,
  eachSlotOfDay,
  timeToGridPosition,
} from './time.ts';

describe('minutesFromMidnight', () => {
  it('returns 0 for midnight', () => {
    expect(minutesFromMidnight(new Date(2026, 1, 11, 0, 0))).toBe(0);
  });

  it('returns 720 for noon', () => {
    expect(minutesFromMidnight(new Date(2026, 1, 11, 12, 0))).toBe(720);
  });

  it('returns 1439 for 11:59 PM', () => {
    expect(minutesFromMidnight(new Date(2026, 1, 11, 23, 59))).toBe(1439);
  });

  it('returns 570 for 9:30 AM', () => {
    expect(minutesFromMidnight(new Date(2026, 1, 11, 9, 30))).toBe(570);
  });
});

describe('dateFromMinutes', () => {
  it('creates date at 9:30 AM from 570 minutes', () => {
    const base = new Date(2026, 1, 11);
    const result = dateFromMinutes(base, 570);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(11);
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(30);
  });

  it('creates midnight date from 0 minutes', () => {
    const base = new Date(2026, 1, 11, 15, 45);
    const result = dateFromMinutes(base, 0);

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getDate()).toBe(11);
  });

  it('creates next day midnight from 1440 minutes', () => {
    const base = new Date(2026, 1, 11);
    const result = dateFromMinutes(base, 1440);

    expect(result.getDate()).toBe(12);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });
});

describe('snapToSlot', () => {
  it('rounds 7 minutes down to 0 with snap 15', () => {
    expect(snapToSlot(7, 15)).toBe(0);
  });

  it('rounds 8 minutes up to 15 with snap 15', () => {
    expect(snapToSlot(8, 15)).toBe(15);
  });

  it('rounds 22 minutes to 30 with snap 30', () => {
    expect(snapToSlot(22, 30)).toBe(30);
  });

  it('rounds 14 minutes down to 0 with snap 30', () => {
    expect(snapToSlot(14, 30)).toBe(0);
  });

  it('keeps 45 minutes exactly with snap 15', () => {
    expect(snapToSlot(45, 15)).toBe(45);
  });

  it('keeps 0 minutes exactly with snap 15', () => {
    expect(snapToSlot(0, 15)).toBe(0);
  });
});

describe('eachSlotOfDay', () => {
  it('returns 48 slots for full day with 30 min duration', () => {
    const slots = eachSlotOfDay(0, 24, 30);
    expect(slots).toHaveLength(48);
  });

  it('returns 10 slots for 8-18 with 60 min duration', () => {
    const slots = eachSlotOfDay(8, 18, 60);
    expect(slots).toHaveLength(10);
  });

  it('first slot of full day 30min has correct values', () => {
    const slots = eachSlotOfDay(0, 24, 30);

    expect(slots[0]).toEqual({
      start: 0,
      end: 30,
      label: '12:00 AM',
    });
  });

  it('last slot of full day 30min has correct values', () => {
    const slots = eachSlotOfDay(0, 24, 30);

    expect(slots[slots.length - 1]).toEqual({
      start: 1410,
      end: 1440,
      label: '11:30 PM',
    });
  });

  it('first slot of 8-18 60min has correct values', () => {
    const slots = eachSlotOfDay(8, 18, 60);

    expect(slots[0]).toEqual({
      start: 480,
      end: 540,
      label: '8:00 AM',
    });
  });
});

describe('timeToGridPosition', () => {
  it('returns correct position for 9:00 AM with default config', () => {
    const date = new Date(2026, 1, 11, 9, 0);
    const config = { startHour: 0, endHour: 24, slotDuration: 30, slotHeight: 48, snapDuration: 15 };

    expect(timeToGridPosition(date, config)).toBe(864);
  });

  it('returns 0 for midnight with default config starting at 0', () => {
    const date = new Date(2026, 1, 11, 0, 0);
    const config = { startHour: 0, endHour: 24, slotDuration: 30, slotHeight: 48, snapDuration: 15 };

    expect(timeToGridPosition(date, config)).toBe(0);
  });

  it('returns correct position for 6:00 PM with startHour=8', () => {
    const date = new Date(2026, 1, 11, 18, 0);
    const config = { startHour: 8, endHour: 24, slotDuration: 30, slotHeight: 48, snapDuration: 15 };

    expect(timeToGridPosition(date, config)).toBe(960);
  });
});
