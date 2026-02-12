import type { Locale } from 'date-fns';
import type { CalendarEvent } from './event.ts';
import type { CalendarView, ViewConfig } from './view.ts';
import type { TimeGridConfig, TimezoneConfig, WeekStartsOn } from './datetime.ts';
import type { CalendarCallbacks } from './callbacks.ts';
import type { CalendarSlots } from './slots.ts';

export interface CalendarProps<TMeta = Record<string, unknown>> extends CalendarCallbacks<TMeta> {
  events: CalendarEvent<TMeta>[];
  date?: Date;
  view?: CalendarView;
  defaultDate?: Date;
  defaultView?: CalendarView;
  viewConfig?: ViewConfig;
  timeGrid?: TimeGridConfig;
  timezones?: TimezoneConfig;
  weekStartsOn?: WeekStartsOn;
  locale?: Locale;
  monthMaxEvents?: number;
  draggable?: boolean;
  resizable?: boolean;
  height?: string | number;
  slots?: CalendarSlots<TMeta>;
  className?: string;
  style?: React.CSSProperties;
}
