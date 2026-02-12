import { useCallback, useRef, useEffect } from 'react';
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfDay,
} from 'date-fns';
import type { CalendarView } from '../types/view.ts';
import type { WeekStartsOn } from '../types/datetime.ts';
import { DEFAULT_N_DAYS, DEFAULT_AGENDA_LENGTH } from '../utils/constants.ts';

export interface UseNavigationOptions {
  weekStartsOn: WeekStartsOn;
  nDays?: number;
  agendaLength?: number;
}

export interface NavigationActions {
  goToToday: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToDate: (date: Date) => void;
}

export function useNavigation(
  date: Date,
  view: CalendarView,
  setDate: (date: Date) => void,
  opts: UseNavigationOptions,
): NavigationActions {
  const dateRef = useRef(date);
  const viewRef = useRef(view);
  const setDateRef = useRef(setDate);
  const optsRef = useRef(opts);

  useEffect(() => {
    dateRef.current = date;
    viewRef.current = view;
    setDateRef.current = setDate;
    optsRef.current = opts;
  });

  const goToToday = useCallback(() => {
    setDateRef.current(startOfDay(new Date()));
  }, []);

  const goToNext = useCallback(() => {
    const d = dateRef.current;
    const v = viewRef.current;
    const o = optsRef.current;

    switch (v) {
      case 'day':
        setDateRef.current(addDays(d, 1));
        break;
      case 'week':
        setDateRef.current(addWeeks(d, 1));
        break;
      case 'n-days':
        setDateRef.current(addDays(d, o.nDays ?? DEFAULT_N_DAYS));
        break;
      case 'month':
        setDateRef.current(addMonths(d, 1));
        break;
      case 'year':
        setDateRef.current(addYears(d, 1));
        break;
      case 'agenda':
        setDateRef.current(addDays(d, o.agendaLength ?? DEFAULT_AGENDA_LENGTH));
        break;
    }
  }, []);

  const goToPrev = useCallback(() => {
    const d = dateRef.current;
    const v = viewRef.current;
    const o = optsRef.current;

    switch (v) {
      case 'day':
        setDateRef.current(subDays(d, 1));
        break;
      case 'week':
        setDateRef.current(subWeeks(d, 1));
        break;
      case 'n-days':
        setDateRef.current(subDays(d, o.nDays ?? DEFAULT_N_DAYS));
        break;
      case 'month':
        setDateRef.current(subMonths(d, 1));
        break;
      case 'year':
        setDateRef.current(subYears(d, 1));
        break;
      case 'agenda':
        setDateRef.current(subDays(d, o.agendaLength ?? DEFAULT_AGENDA_LENGTH));
        break;
    }
  }, []);

  const goToDate = useCallback((d: Date) => {
    setDateRef.current(d);
  }, []);

  return { goToToday, goToPrev, goToNext, goToDate };
}
