import { describe, it, expect } from 'vitest';
import { computeEventLayout } from './layout.ts';
import type { CalendarEvent } from '../types/event.ts';
import { DEFAULT_TIME_GRID_CONFIG } from './constants.ts';

function makeEvent(overrides: Partial<CalendarEvent> & { start: Date; end: Date }): CalendarEvent {
  return {
    id: overrides.id ?? '1',
    title: overrides.title ?? 'Test Event',
    ...overrides,
  };
}

const feb11 = new Date(2026, 1, 11);
const config = DEFAULT_TIME_GRID_CONFIG;

describe('computeEventLayout', () => {
  it('returns empty array for no events', () => {
    expect(computeEventLayout([], feb11, config)).toEqual([]);
  });

  it('lays out a single event 9:00-10:00', () => {
    const events = [
      makeEvent({
        id: '1',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(1);
    expect(result[0].column).toBe(0);
    expect(result[0].totalColumns).toBe(1);
    expect(result[0].top).toBe(864);
    expect(result[0].height).toBe(96);
  });

  it('lays out two overlapping events', () => {
    const events = [
      makeEvent({
        id: 'a',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'b',
        start: new Date(2026, 1, 11, 9, 30),
        end: new Date(2026, 1, 11, 10, 30),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(2);

    const a = result.find((r) => r.event.id === 'a')!;
    const b = result.find((r) => r.event.id === 'b')!;

    expect(a.column).toBe(0);
    expect(a.totalColumns).toBe(2);
    expect(a.top).toBe(864);
    expect(a.height).toBe(96);

    expect(b.column).toBe(1);
    expect(b.totalColumns).toBe(2);
    expect(b.top).toBe(912);
    expect(b.height).toBe(96);
  });

  it('lays out three transitively connected events (A-B overlap, B-C overlap, A-C dont)', () => {
    const events = [
      makeEvent({
        id: 'a',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'b',
        start: new Date(2026, 1, 11, 9, 30),
        end: new Date(2026, 1, 11, 11, 0),
      }),
      makeEvent({
        id: 'c',
        start: new Date(2026, 1, 11, 10, 30),
        end: new Date(2026, 1, 11, 11, 30),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(3);

    const a = result.find((r) => r.event.id === 'a')!;
    const b = result.find((r) => r.event.id === 'b')!;
    const c = result.find((r) => r.event.id === 'c')!;

    expect(a.column).toBe(0);
    expect(b.column).toBe(1);
    expect(c.column).toBe(0);

    expect(a.totalColumns).toBe(2);
    expect(b.totalColumns).toBe(2);
    expect(c.totalColumns).toBe(2);
  });

  it('treats adjacent non-overlapping events as separate groups', () => {
    const events = [
      makeEvent({
        id: 'a',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'b',
        start: new Date(2026, 1, 11, 10, 0),
        end: new Date(2026, 1, 11, 11, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(2);

    const a = result.find((r) => r.event.id === 'a')!;
    const b = result.find((r) => r.event.id === 'b')!;

    expect(a.column).toBe(0);
    expect(a.totalColumns).toBe(1);
    expect(b.column).toBe(0);
    expect(b.totalColumns).toBe(1);
  });

  it('filters out all-day events', () => {
    const events = [
      makeEvent({
        id: 'allday',
        start: new Date(2026, 1, 11, 0, 0),
        end: new Date(2026, 1, 12, 0, 0),
        allDay: true,
      }),
      makeEvent({
        id: 'timed',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(1);
    expect(result[0].event.id).toBe('timed');
  });

  it('filters out events not on the target date', () => {
    const events = [
      makeEvent({
        id: 'wrong-day',
        start: new Date(2026, 1, 12, 9, 0),
        end: new Date(2026, 1, 12, 10, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(0);
  });

  it('lays out multiple non-overlapping events on the same day', () => {
    const events = [
      makeEvent({
        id: 'morning',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'afternoon',
        start: new Date(2026, 1, 11, 14, 0),
        end: new Date(2026, 1, 11, 15, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(2);

    const morning = result.find((r) => r.event.id === 'morning')!;
    const afternoon = result.find((r) => r.event.id === 'afternoon')!;

    expect(morning.column).toBe(0);
    expect(morning.totalColumns).toBe(1);
    expect(afternoon.column).toBe(0);
    expect(afternoon.totalColumns).toBe(1);
  });

  it('gives longer events priority (column 0) when starting at the same time', () => {
    const events = [
      makeEvent({
        id: 'short',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'long',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 11, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(2);

    const long = result.find((r) => r.event.id === 'long')!;
    const short = result.find((r) => r.event.id === 'short')!;

    expect(long.column).toBe(0);
    expect(short.column).toBe(1);
  });

  it('clamps events that span midnight to the target day boundaries', () => {
    const events = [
      makeEvent({
        id: 'spanning',
        start: new Date(2026, 1, 10, 22, 0),
        end: new Date(2026, 1, 11, 3, 0),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(1);
    expect(result[0].top).toBe(0);
    expect(result[0].height).toBe(180 * (48 / 30));
  });

  it('enforces minimum height', () => {
    const events = [
      makeEvent({
        id: 'tiny',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 9, 1),
      }),
    ];

    const result = computeEventLayout(events, feb11, config);

    expect(result).toHaveLength(1);
    expect(result[0].height).toBe(config.slotHeight / 2);
  });
});
