export type EventId = string | number;

export type EventColor =
  | 'tomato'
  | 'flamingo'
  | 'tangerine'
  | 'banana'
  | 'sage'
  | 'basil'
  | 'peacock'
  | 'blueberry'
  | 'lavender'
  | 'grape'
  | 'graphite';

export interface CalendarEvent<TMeta = Record<string, unknown>> {
  id: EventId;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor | string;
  draggable?: boolean;
  resizable?: boolean;
  calendarId?: string;
  description?: string;
  location?: string;
  meta?: TMeta;
}
