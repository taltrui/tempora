import type { CalendarEvent } from './event.ts';
import type { CalendarView } from './view.ts';

export interface EventMovePayload<TMeta = Record<string, unknown>> {
  event: CalendarEvent<TMeta>;
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface EventResizePayload<TMeta = Record<string, unknown>> {
  event: CalendarEvent<TMeta>;
  start: Date;
  end: Date;
}

export interface SlotPressPayload {
  start: Date;
  end: Date;
  allDay: boolean;
  view: CalendarView;
}

export interface DateRangePayload {
  start: Date;
  end: Date;
  view: CalendarView;
}

export interface CalendarCallbacks<TMeta = Record<string, unknown>> {
  onEventPress?: (event: CalendarEvent<TMeta>, e: React.MouseEvent) => void;
  onEventDoubleClick?: (event: CalendarEvent<TMeta>, e: React.MouseEvent) => void;
  onEventMove?: (payload: EventMovePayload<TMeta>) => void;
  onEventResize?: (payload: EventResizePayload<TMeta>) => void;
  onSlotPress?: (payload: SlotPressPayload) => void;
  onDateClick?: (date: Date, view: CalendarView) => void;
  onShowMore?: (date: Date, events: CalendarEvent<TMeta>[]) => void;
  onRangeChange?: (payload: DateRangePayload) => void;
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
}
