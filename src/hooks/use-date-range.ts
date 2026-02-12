import { useMemo } from 'react';
import type { CalendarView } from '../types/view.ts';
import type { TimeRange, WeekStartsOn } from '../types/datetime.ts';
import { getVisibleRange } from '../utils/date.ts';

export function useDateRange(
  date: Date,
  view: CalendarView,
  opts: { weekStartsOn: WeekStartsOn; nDays?: number; agendaLength?: number },
): TimeRange {
  const { weekStartsOn, nDays, agendaLength } = opts;
  return useMemo(
    () => getVisibleRange(date, view, { weekStartsOn, nDays, agendaLength }),
    [date, view, weekStartsOn, nDays, agendaLength],
  );
}
