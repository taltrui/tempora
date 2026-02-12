import { createContext, use } from 'react';
import type { CalendarEvent } from '../types/event.ts';
import type { CalendarView, ViewConfig } from '../types/view.ts';
import type { TimeRange, WeekStartsOn, TimeGridConfig, TimezoneConfig } from '../types/datetime.ts';
import type { EventMovePayload, EventResizePayload, SlotPressPayload } from '../types/callbacks.ts';
import type { CalendarSlots } from '../types/slots.ts';
import type { NavigationActions } from '../hooks/use-navigation.ts';
import type { Locale } from 'date-fns';

export interface CalendarConfigValue<TMeta = Record<string, unknown>> {
  weekStartsOn: WeekStartsOn;
  timeGridConfig: TimeGridConfig;
  monthMaxEvents: number;
  timezones?: TimezoneConfig;
  viewConfig?: ViewConfig;
  locale?: Locale;
  slots?: CalendarSlots<TMeta>;
  draggableEnabled: boolean;
  resizableEnabled: boolean;
  onEventPress?: (event: CalendarEvent<TMeta>, e: React.MouseEvent) => void;
  onEventDoubleClick?: (event: CalendarEvent<TMeta>, e: React.MouseEvent) => void;
  onSlotPress?: (payload: SlotPressPayload) => void;
  onDateClick?: (date: Date, view: CalendarView) => void;
  onShowMore?: (date: Date, events: CalendarEvent<TMeta>[]) => void;
  onEventMove?: (payload: EventMovePayload<TMeta>) => void;
  onEventResize?: (payload: EventResizePayload<TMeta>) => void;
}

export interface CalendarStateValue<TMeta = Record<string, unknown>> {
  date: Date;
  view: CalendarView;
  visibleRange: TimeRange;
  visibleEvents: CalendarEvent<TMeta>[];
  navigation: NavigationActions;
  setView: (view: CalendarView) => void;
  dateLabel: string;
}

export type CalendarContextValue<TMeta = Record<string, unknown>> =
  CalendarConfigValue<TMeta> & CalendarStateValue<TMeta>;

export const CalendarConfigContext = createContext<CalendarConfigValue | null>(null);
export const CalendarStateContext = createContext<CalendarStateValue | null>(null);

export function useCalendarConfig<
  TMeta = Record<string, unknown>,
>(): CalendarConfigValue<TMeta> {
  const ctx = use(CalendarConfigContext);
  if (!ctx) {
    throw new Error(
      'useCalendarConfig must be used within CalendarProvider',
    );
  }
  return ctx as CalendarConfigValue<TMeta>;
}

export function useCalendarState<
  TMeta = Record<string, unknown>,
>(): CalendarStateValue<TMeta> {
  const ctx = use(CalendarStateContext);
  if (!ctx) {
    throw new Error(
      'useCalendarState must be used within CalendarProvider',
    );
  }
  return ctx as CalendarStateValue<TMeta>;
}

export function useCalendarContext<
  TMeta = Record<string, unknown>,
>(): CalendarContextValue<TMeta> {
  const config = useCalendarConfig<TMeta>();
  const state = useCalendarState<TMeta>();
  return { ...config, ...state };
}
