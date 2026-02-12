import { describe, it, expect } from 'vitest';
import { groupEventsByDate, sortEvents, filterEventsForRange, getDateKey, getEventColors } from './event.ts';
import type { CalendarEvent } from '../types/event.ts';

function makeEvent(overrides: Partial<CalendarEvent> & { start: Date; end: Date }): CalendarEvent {
  return {
    id: overrides.id ?? '1',
    title: overrides.title ?? 'Test Event',
    ...overrides,
  };
}

describe('getDateKey', () => {
  it('formats Feb 11 2026', () => {
    expect(getDateKey(new Date(2026, 1, 11))).toBe('2026-02-11');
  });

  it('formats Jan 1 2026', () => {
    expect(getDateKey(new Date(2026, 0, 1))).toBe('2026-01-01');
  });

  it('formats Dec 31 2026', () => {
    expect(getDateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('formats single-digit month and day with zero padding', () => {
    expect(getDateKey(new Date(2026, 2, 5))).toBe('2026-03-05');
  });
});

describe('getEventColors', () => {
  it('returns default peacock bg and white text when no color', () => {
    const result = getEventColors();
    expect(result.bg).toBe('#039BE5');
    expect(result.text).toBe('#fff');
  });

  it('returns dark text for light colors', () => {
    const result = getEventColors('banana');
    expect(result.text).toBe('#3c4043');
  });

  it('returns white text for dark colors', () => {
    const result = getEventColors('tomato');
    expect(result.text).toBe('#fff');
  });

  it('passes through custom hex colors', () => {
    const result = getEventColors('#ff0000');
    expect(result.bg).toBe('#ff0000');
    expect(result.text).toBe('#fff');
  });
});

describe('sortEvents', () => {
  it('sorts all-day events before timed events', () => {
    const timed = makeEvent({
      id: 'timed',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });
    const allDay = makeEvent({
      id: 'allday',
      title: 'All Day',
      start: new Date(2026, 1, 11, 0, 0),
      end: new Date(2026, 1, 12, 0, 0),
      allDay: true,
    });

    const result = sortEvents([timed, allDay]);
    expect(result[0].id).toBe('allday');
    expect(result[1].id).toBe('timed');
  });

  it('sorts timed events by start time ascending', () => {
    const later = makeEvent({
      id: 'later',
      start: new Date(2026, 1, 11, 14, 0),
      end: new Date(2026, 1, 11, 15, 0),
    });
    const earlier = makeEvent({
      id: 'earlier',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });

    const result = sortEvents([later, earlier]);
    expect(result[0].id).toBe('earlier');
    expect(result[1].id).toBe('later');
  });

  it('sorts same start time by duration descending (longer first)', () => {
    const short = makeEvent({
      id: 'short',
      title: 'Short',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });
    const long = makeEvent({
      id: 'long',
      title: 'Long',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 12, 0),
    });

    const result = sortEvents([short, long]);
    expect(result[0].id).toBe('long');
    expect(result[1].id).toBe('short');
  });

  it('sorts same start and duration by title alphabetically', () => {
    const b = makeEvent({
      id: 'b',
      title: 'Bravo',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });
    const a = makeEvent({
      id: 'a',
      title: 'Alpha',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });

    const result = sortEvents([b, a]);
    expect(result[0].id).toBe('a');
    expect(result[1].id).toBe('b');
  });
});

describe('filterEventsForRange', () => {
  const range = {
    start: new Date(2026, 1, 11, 0, 0),
    end: new Date(2026, 1, 12, 0, 0),
  };

  it('includes event fully inside range', () => {
    const event = makeEvent({
      id: 'inside',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(1);
  });

  it('includes event partially overlapping at the start', () => {
    const event = makeEvent({
      id: 'overlap-start',
      start: new Date(2026, 1, 10, 22, 0),
      end: new Date(2026, 1, 11, 2, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(1);
  });

  it('includes event partially overlapping at the end', () => {
    const event = makeEvent({
      id: 'overlap-end',
      start: new Date(2026, 1, 11, 23, 0),
      end: new Date(2026, 1, 12, 1, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(1);
  });

  it('includes event spanning the entire range', () => {
    const event = makeEvent({
      id: 'spanning',
      start: new Date(2026, 1, 10, 0, 0),
      end: new Date(2026, 1, 13, 0, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(1);
  });

  it('excludes event fully outside range (before)', () => {
    const event = makeEvent({
      id: 'before',
      start: new Date(2026, 1, 10, 9, 0),
      end: new Date(2026, 1, 10, 10, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(0);
  });

  it('excludes event fully outside range (after)', () => {
    const event = makeEvent({
      id: 'after',
      start: new Date(2026, 1, 12, 9, 0),
      end: new Date(2026, 1, 12, 10, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(0);
  });

  it('excludes event that ends exactly at range start', () => {
    const event = makeEvent({
      id: 'adjacent-before',
      start: new Date(2026, 1, 10, 22, 0),
      end: new Date(2026, 1, 11, 0, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(0);
  });

  it('excludes event that starts exactly at range end', () => {
    const event = makeEvent({
      id: 'adjacent-after',
      start: new Date(2026, 1, 12, 0, 0),
      end: new Date(2026, 1, 12, 1, 0),
    });
    expect(filterEventsForRange([event], range)).toHaveLength(0);
  });
});

describe('groupEventsByDate', () => {
  it('groups a single event on one day', () => {
    const dates = [new Date(2026, 1, 11)];
    const event = makeEvent({
      id: '1',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });

    const result = groupEventsByDate([event], dates);
    expect(result.get('2026-02-11')).toHaveLength(1);
    expect(result.get('2026-02-11')![0].id).toBe('1');
  });

  it('groups multi-day event on all dates it spans', () => {
    const dates = [
      new Date(2026, 1, 10),
      new Date(2026, 1, 11),
      new Date(2026, 1, 12),
    ];
    const event = makeEvent({
      id: 'multi',
      start: new Date(2026, 1, 10, 14, 0),
      end: new Date(2026, 1, 12, 10, 0),
    });

    const result = groupEventsByDate([event], dates);
    expect(result.get('2026-02-10')).toHaveLength(1);
    expect(result.get('2026-02-11')).toHaveLength(1);
    expect(result.get('2026-02-12')).toHaveLength(1);
  });

  it('groups all-day event on its date', () => {
    const dates = [new Date(2026, 1, 11)];
    const event = makeEvent({
      id: 'allday',
      start: new Date(2026, 1, 11, 0, 0),
      end: new Date(2026, 1, 12, 0, 0),
      allDay: true,
    });

    const result = groupEventsByDate([event], dates);
    expect(result.get('2026-02-11')).toHaveLength(1);
  });

  it('sorts events within group: all-day first, then by start time', () => {
    const dates = [new Date(2026, 1, 11)];
    const timed1 = makeEvent({
      id: 'timed-late',
      title: 'Late',
      start: new Date(2026, 1, 11, 14, 0),
      end: new Date(2026, 1, 11, 15, 0),
    });
    const timed2 = makeEvent({
      id: 'timed-early',
      title: 'Early',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });
    const allDay = makeEvent({
      id: 'allday',
      title: 'All Day',
      start: new Date(2026, 1, 11, 0, 0),
      end: new Date(2026, 1, 12, 0, 0),
      allDay: true,
    });

    const result = groupEventsByDate([timed1, timed2, allDay], dates);
    const events = result.get('2026-02-11')!;
    expect(events[0].id).toBe('allday');
    expect(events[1].id).toBe('timed-early');
    expect(events[2].id).toBe('timed-late');
  });

  it('does not include event on dates it does not span', () => {
    const dates = [
      new Date(2026, 1, 10),
      new Date(2026, 1, 11),
      new Date(2026, 1, 12),
    ];
    const event = makeEvent({
      id: '1',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 10, 0),
    });

    const result = groupEventsByDate([event], dates);
    expect(result.get('2026-02-10') ?? []).toHaveLength(0);
    expect(result.get('2026-02-11')).toHaveLength(1);
    expect(result.get('2026-02-12') ?? []).toHaveLength(0);
  });

  it('returns empty arrays for dates with no events', () => {
    const dates = [new Date(2026, 1, 11)];
    const result = groupEventsByDate([], dates);
    expect(result.get('2026-02-11')).toEqual([]);
  });
});
