import type { EventColor } from '../types/event.ts';
import type { CalendarView } from '../types/view.ts';
import type { TimeGridConfig, WeekStartsOn } from '../types/datetime.ts';

export const DEFAULT_SLOT_DURATION = 30;
export const DEFAULT_SLOT_HEIGHT = 48;
export const DEFAULT_SNAP_DURATION = 15;
export const DEFAULT_START_HOUR = 0;
export const DEFAULT_END_HOUR = 24;
export const DEFAULT_WEEK_STARTS_ON: WeekStartsOn = 0;
export const DEFAULT_VIEW: CalendarView = 'week';
export const DEFAULT_N_DAYS = 4;
export const DEFAULT_MONTH_MAX_EVENTS = 3;
export const DEFAULT_AGENDA_LENGTH = 30;

export const EVENT_COLORS: Record<EventColor, string> = {
  tomato: '#D50000',
  flamingo: '#E67C73',
  tangerine: '#F4511E',
  banana: '#F6BF26',
  sage: '#33B679',
  basil: '#0B8043',
  peacock: '#039BE5',
  blueberry: '#3F51B5',
  lavender: '#7986CB',
  grape: '#8E24AA',
  graphite: '#616161',
};

export const DEFAULT_TIME_GRID_CONFIG: TimeGridConfig = {
  startHour: DEFAULT_START_HOUR,
  endHour: DEFAULT_END_HOUR,
  slotDuration: DEFAULT_SLOT_DURATION,
  slotHeight: DEFAULT_SLOT_HEIGHT,
  snapDuration: DEFAULT_SNAP_DURATION,
};
