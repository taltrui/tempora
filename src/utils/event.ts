import type { CalendarEvent, EventColor } from '../types/event.ts';
import type { TimeRange } from '../types/datetime.ts';
import { startOfDay, endOfDay } from 'date-fns';
import { EVENT_COLORS } from './constants.ts';

const LIGHT_TEXT_COLORS = new Set<EventColor>(['banana', 'flamingo', 'lavender']);

export function isLightEventColor(color?: EventColor | string): boolean {
  if (!color) return false;
  return LIGHT_TEXT_COLORS.has(color as EventColor);
}

export function resolveEventColor(color?: EventColor | string): string {
  if (!color) return EVENT_COLORS.peacock;
  if (color in EVENT_COLORS) return EVENT_COLORS[color as EventColor];
  return color;
}

function contrastTextForHex(hex: string): string | null {
  const raw = hex.replace('#', '');
  const normalized =
    raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  if (normalized.length !== 6 || /[^0-9a-fA-F]/.test(normalized)) return null;

  const channel = (start: number) => {
    const v = parseInt(normalized.slice(start, start + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);

  return luminance > 0.5 ? '#3c4043' : '#fff';
}

export function getEventColors(color?: EventColor | string): { bg: string; text: string } {
  const bg = resolveEventColor(color);
  const isNamed = !!color && color in EVENT_COLORS;

  if (!color || isNamed) {
    return { bg, text: isLightEventColor(color) ? '#3c4043' : '#fff' };
  }

  return { bg, text: contrastTextForHex(bg) ?? '#fff' };
}

export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function sortEvents<TMeta>(events: CalendarEvent<TMeta>[]): CalendarEvent<TMeta>[] {
  return [...events].sort((a, b) => {
    const aAllDay = a.allDay ? 0 : 1;
    const bAllDay = b.allDay ? 0 : 1;
    if (aAllDay !== bAllDay) return aAllDay - bAllDay;

    const startDiff = a.start.getTime() - b.start.getTime();
    if (startDiff !== 0) return startDiff;

    const aDuration = a.end.getTime() - a.start.getTime();
    const bDuration = b.end.getTime() - b.start.getTime();
    if (aDuration !== bDuration) return bDuration - aDuration;

    return a.title.localeCompare(b.title);
  });
}

export function filterEventsForRange<TMeta>(
  events: CalendarEvent<TMeta>[],
  range: TimeRange,
): CalendarEvent<TMeta>[] {
  return events.filter(
    (event) => event.start < range.end && event.end > range.start,
  );
}

export function groupEventsByDate<TMeta>(
  events: CalendarEvent<TMeta>[],
  dates: Date[],
): Map<string, CalendarEvent<TMeta>[]> {
  const map = new Map<string, CalendarEvent<TMeta>[]>();

  for (const date of dates) {
    map.set(getDateKey(date), []);
  }

  for (const event of events) {
    for (const date of dates) {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      if (event.start <= dayEnd && event.end > dayStart) {
        const key = getDateKey(date);
        map.get(key)?.push(event);
      }
    }
  }

  for (const [key, evts] of map) {
    map.set(key, sortEvents(evts));
  }

  return map;
}
