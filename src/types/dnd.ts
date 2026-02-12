import type { CalendarEvent, EventId } from './event.ts';

export type SlotId = string;

export interface DragData {
  type: 'event-move' | 'event-resize-top' | 'event-resize-bottom';
  eventId: EventId;
  event: CalendarEvent;
  originalStart: Date;
  originalEnd: Date;
}

export function isDragData(data: unknown): data is DragData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    (d.type === 'event-move' || d.type === 'event-resize-top' || d.type === 'event-resize-bottom') &&
    'event' in d &&
    'originalStart' in d &&
    'originalEnd' in d
  );
}

export interface DropSlotData {
  date: Date;
  minutes: number;
  allDay: boolean;
}
