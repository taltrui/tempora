import { useMemo } from 'react';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { useCurrentTime } from '../../../hooks/use-current-time.ts';
import { getMonthsForYear } from '../../../utils/date.ts';
import { MiniCalendar } from '../../shared/mini-calendar/mini-calendar.tsx';
import styles from './year-view.module.scss';

export function YearView() {
  const { weekStartsOn, onDateClick } = useCalendarConfig();
  const { date, view } = useCalendarState();

  const months = useMemo(
    () => getMonthsForYear(date.getFullYear()),
    [date],
  );

  const today = useCurrentTime();

  return (
    <div className={styles.yearView}>
      {months.map((month) => (
        <MiniCalendar
          key={month.getMonth()}
          month={month}
          weekStartsOn={weekStartsOn}
          today={today}
          onDateClick={(d) => onDateClick?.(d, view)}
        />
      ))}
    </div>
  );
}
