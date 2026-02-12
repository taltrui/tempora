import { useMemo } from 'react';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { TimeGrid } from '../../shared/time-grid/time-grid.tsx';

export function DayView() {
  const { timeGridConfig } = useCalendarConfig();
  const { date, visibleEvents } = useCalendarState();

  const dates = useMemo(() => [date], [date]);

  return (
    <TimeGrid dates={dates} events={visibleEvents} config={timeGridConfig} />
  );
}
