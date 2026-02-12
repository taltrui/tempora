export type {
  CalendarEvent,
  EventId,
  EventColor,
  CalendarView,
  ViewConfig,
  NDaysConfig,
  TimeRange,
  TimeSlot,
  DayColumn,
  WeekStartsOn,
  TimezoneConfig,
  TimeGridConfig,
  CalendarCallbacks,
  EventMovePayload,
  EventResizePayload,
  SlotPressPayload,
  DateRangePayload,
  CalendarSlots,
  ToolbarSlotProps,
  EventContentSlotProps,
  EventWrapperSlotProps,
  DayHeaderSlotProps,
  TimeGutterLabelSlotProps,
  DayCellSlotProps,
  ShowMoreButtonSlotProps,
  SlotId,
  DragData,
  DropSlotData,
  CalendarProps,
} from './types/index.ts';

export {
  DEFAULT_SLOT_DURATION,
  DEFAULT_SLOT_HEIGHT,
  DEFAULT_SNAP_DURATION,
  DEFAULT_START_HOUR,
  DEFAULT_END_HOUR,
  DEFAULT_WEEK_STARTS_ON,
  DEFAULT_VIEW,
  DEFAULT_N_DAYS,
  DEFAULT_MONTH_MAX_EVENTS,
  DEFAULT_AGENDA_LENGTH,
  EVENT_COLORS,
  DEFAULT_TIME_GRID_CONFIG,
} from './utils/constants.ts';

export { clsx } from './utils/clsx.ts';

export { computeEventLayout } from './utils/layout.ts';
export type { LayoutedEvent } from './utils/layout.ts';

export { groupEventsByDate, sortEvents, filterEventsForRange, getDateKey, resolveEventColor, getEventColors } from './utils/event.ts';

export { useControllable } from './hooks/use-controllable.ts';
export type { UseControllableOptions } from './hooks/use-controllable.ts';
export { useNavigation } from './hooks/use-navigation.ts';
export type { UseNavigationOptions, NavigationActions } from './hooks/use-navigation.ts';
export { useDateRange } from './hooks/use-date-range.ts';
export { useViewState } from './hooks/use-view-state.ts';
export type { UseViewStateProps, ViewState } from './hooks/use-view-state.ts';
export { useCalendar } from './hooks/use-calendar.ts';
export type { UseCalendarReturn } from './hooks/use-calendar.ts';
export { useEventLayout } from './hooks/use-event-layout.ts';
export { useTimeGrid } from './hooks/use-time-grid.ts';
export type { UseTimeGridReturn } from './hooks/use-time-grid.ts';
export { useDragEvent } from './hooks/use-drag-event.ts';
export { useResizeEvent } from './hooks/use-resize-event.ts';

export { Calendar } from './components/calendar/calendar.tsx';
export { useCalendarContext, useCalendarConfig, useCalendarState } from './context/calendar-context.ts';
export type { CalendarContextValue, CalendarConfigValue, CalendarStateValue } from './context/calendar-context.ts';
