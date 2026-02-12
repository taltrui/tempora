import { useMemo } from 'react';
import { addDays } from 'date-fns';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { getVisibleDaysForWeek } from '../../../utils/date.ts';
import { TimeGrid } from '../../shared/time-grid/time-grid.tsx';

interface WeekViewProps {
  nDays?: number;
}

export function WeekView({ nDays }: WeekViewProps) {
  const { weekStartsOn, timeGridConfig } = useCalendarConfig();
  const { date, visibleEvents } = useCalendarState();

  const dates = useMemo(() => {
    if (nDays && nDays !== 7) {
      return Array.from({ length: nDays }, (_, i) => addDays(date, i));
    }
    return getVisibleDaysForWeek(date, weekStartsOn);
  }, [date, weekStartsOn, nDays]);

  return (
    <TimeGrid dates={dates} events={visibleEvents} config={timeGridConfig} />
  );
}
