import { startOfDay, endOfDay } from 'date-fns';
import type { CalendarEvent } from '../types/event.ts';
import type { TimeGridConfig } from '../types/datetime.ts';
import { minutesFromMidnight } from './time.ts';

export interface LayoutedEvent<TMeta = Record<string, unknown>> {
  event: CalendarEvent<TMeta>;
  column: number;
  totalColumns: number;
  top: number;
  height: number;
}

interface PlacedEvent<TMeta> {
  event: CalendarEvent<TMeta>;
  startMinutes: number;
  endMinutes: number;
  column: number;
}

function overlaps<TMeta>(a: PlacedEvent<TMeta>, b: PlacedEvent<TMeta>): boolean {
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
}

export function computeEventLayout<TMeta>(
  events: CalendarEvent<TMeta>[],
  date: Date,
  config: TimeGridConfig,
): LayoutedEvent<TMeta>[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const gridStartMinutes = config.startHour * 60;
  const gridEndMinutes = config.endHour * 60;
  const pixelsPerMinute = config.slotHeight / config.slotDuration;
  const minHeight = config.slotHeight / 2;

  const filtered = events.filter(
    (e) => !e.allDay && e.start < dayEnd && e.end > dayStart,
  );

  const withMinutes = filtered.map((event) => {
    const clampedStart = event.start < dayStart ? dayStart : event.start;
    const clampedEnd = event.end > dayEnd ? dayEnd : event.end;
    const startMinutes = Math.max(minutesFromMidnight(clampedStart), 0);
    const endMinutes = Math.min(
      clampedEnd > dayEnd ? 1440 : (minutesFromMidnight(clampedEnd) === 0 ? 1440 : minutesFromMidnight(clampedEnd)),
      1440,
    );
    return { event, startMinutes, endMinutes };
  });

  withMinutes.sort((a, b) => {
    if (a.startMinutes !== b.startMinutes) return a.startMinutes - b.startMinutes;
    const durA = a.endMinutes - a.startMinutes;
    const durB = b.endMinutes - b.startMinutes;
    return durB - durA;
  });

  const columns: PlacedEvent<TMeta>[][] = [];
  const placed: PlacedEvent<TMeta>[] = [];

  for (const item of withMinutes) {
    let assignedColumn = -1;

    for (let col = 0; col < columns.length; col++) {
      const hasOverlap = columns[col].some((existing) =>
        existing.startMinutes < item.endMinutes && item.startMinutes < existing.endMinutes,
      );
      if (!hasOverlap) {
        assignedColumn = col;
        break;
      }
    }

    if (assignedColumn === -1) {
      assignedColumn = columns.length;
      columns.push([]);
    }

    const placedEvent: PlacedEvent<TMeta> = {
      event: item.event,
      startMinutes: item.startMinutes,
      endMinutes: item.endMinutes,
      column: assignedColumn,
    };

    columns[assignedColumn].push(placedEvent);
    placed.push(placedEvent);
  }

  const groups: PlacedEvent<TMeta>[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < placed.length; i++) {
    if (visited.has(i)) continue;

    const group: PlacedEvent<TMeta>[] = [];
    const stack = [i];

    while (stack.length > 0) {
      const idx = stack.pop();
      if (idx === undefined) continue;
      if (visited.has(idx)) continue;
      visited.add(idx);
      group.push(placed[idx]);

      for (let j = 0; j < placed.length; j++) {
        if (!visited.has(j) && overlaps(placed[idx], placed[j])) {
          stack.push(j);
        }
      }
    }

    groups.push(group);
  }

  const totalColumnsMap = new Map<CalendarEvent<TMeta>, number>();

  for (const group of groups) {
    const maxColumn = Math.max(...group.map((p) => p.column));
    const totalColumns = maxColumn + 1;
    for (const p of group) {
      totalColumnsMap.set(p.event, totalColumns);
    }
  }

  return placed.map((p) => {
    const clampedStart = Math.max(p.startMinutes, gridStartMinutes);
    const clampedEnd = Math.min(p.endMinutes, gridEndMinutes);
    const top = (clampedStart - gridStartMinutes) * pixelsPerMinute;
    const rawHeight = (clampedEnd - clampedStart) * pixelsPerMinute;

    return {
      event: p.event,
      column: p.column,
      totalColumns: totalColumnsMap.get(p.event) ?? 1,
      top,
      height: Math.max(rawHeight, minHeight),
    };
  });
}
