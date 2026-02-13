import type { CalendarView } from './view.ts';
import type { CalendarEvent } from './event.ts';

export interface ToolbarSlotProps {
  date: Date;
  view: CalendarView;
  dateLabel: string;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
}

export interface EventContentSlotProps<TMeta = Record<string, unknown>> {
  event: CalendarEvent<TMeta>;
  view: CalendarView;
}

export interface EventWrapperSlotProps<TMeta = Record<string, unknown>> {
  event: CalendarEvent<TMeta>;
  children: React.ReactNode;
}

export interface DayHeaderSlotProps {
  date: Date;
  isToday: boolean;
  view: CalendarView;
}

export interface TimeGutterLabelSlotProps {
  time: Date;
  timezone?: string;
}

export interface DayCellSlotProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isOutsideMonth: boolean;
}

export interface ShowMoreButtonSlotProps<TMeta = Record<string, unknown>> {
  date: Date;
  count: number;
  events: CalendarEvent<TMeta>[];
}

export interface CalendarSlots<TMeta = Record<string, unknown>> {
  toolbar?: React.ComponentType<ToolbarSlotProps>;
  eventContent?: React.ComponentType<EventContentSlotProps<TMeta>>;
  eventWrapper?: React.ComponentType<EventWrapperSlotProps<TMeta>>;
  dayHeader?: React.ComponentType<DayHeaderSlotProps>;
  timeGutterLabel?: React.ComponentType<TimeGutterLabelSlotProps>;
  dayCell?: React.ComponentType<DayCellSlotProps>;
  showMoreButton?: React.ComponentType<ShowMoreButtonSlotProps<TMeta>>;
}
