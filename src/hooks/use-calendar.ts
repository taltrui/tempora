import { useMemo, useEffect, useRef } from 'react';
import type { CalendarEvent } from '../types/event.ts';
import type { CalendarView } from '../types/view.ts';
import type { TimeRange } from '../types/datetime.ts';
import type { CalendarProps } from '../types/calendar.ts';
import { DEFAULT_WEEK_STARTS_ON, DEFAULT_N_DAYS, DEFAULT_AGENDA_LENGTH } from '../utils/constants.ts';
import { formatDateLabel } from '../utils/date.ts';
import { useViewState } from './use-view-state.ts';
import { useNavigation, type NavigationActions } from './use-navigation.ts';
import { useDateRange } from './use-date-range.ts';

export interface UseCalendarReturn<TMeta = Record<string, unknown>> {
  date: Date;
  view: CalendarView;
  visibleRange: TimeRange;
  visibleEvents: CalendarEvent<TMeta>[];
  navigation: NavigationActions;
  setView: (view: CalendarView) => void;
  dateLabel: string;
}

export function useCalendar<TMeta = Record<string, unknown>>(
  props: CalendarProps<TMeta>,
): UseCalendarReturn<TMeta> {
  const weekStartsOn = props.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const nDays = props.viewConfig?.nDays?.count ?? DEFAULT_N_DAYS;
  const agendaLength = props.viewConfig?.agenda?.length ?? DEFAULT_AGENDA_LENGTH;

  const { date, view, setDate, setView } = useViewState({
    date: props.date,
    defaultDate: props.defaultDate,
    view: props.view,
    defaultView: props.defaultView,
    onDateChange: props.onDateChange,
    onViewChange: props.onViewChange,
  });

  const navigation = useNavigation(date, view, setDate, {
    weekStartsOn,
    nDays,
    agendaLength,
  });

  const visibleRange = useDateRange(date, view, {
    weekStartsOn,
    nDays,
    agendaLength,
  });

  const visibleEvents = useMemo(
    () =>
      props.events.filter(
        (event) => event.start < visibleRange.end && event.end > visibleRange.start,
      ),
    [props.events, visibleRange],
  );

  const dateLabel = useMemo(
    () => formatDateLabel(date, view, props.locale),
    [date, view, props.locale],
  );

  const onRangeChangeRef = useRef(props.onRangeChange);
  useEffect(() => {
    onRangeChangeRef.current = props.onRangeChange;
  });

  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    onRangeChangeRef.current?.({
      start: visibleRange.start,
      end: visibleRange.end,
      view,
    });
  }, [visibleRange, view]);

  return {
    date,
    view,
    visibleRange,
    visibleEvents,
    navigation,
    setView,
    dateLabel,
  };
}
