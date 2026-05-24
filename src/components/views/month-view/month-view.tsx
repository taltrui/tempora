import { useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { useCurrentTime } from '../../../hooks/use-current-time.ts';
import { getVisibleDaysForMonth, getWeekdayLabels } from '../../../utils/date.ts';
import { groupEventsByDate, getDateKey } from '../../../utils/event.ts';
import { DayCell } from '../../shared/day-cell/day-cell.tsx';
import styles from './month-view.module.scss';

export function MonthView() {
  const { weekStartsOn, monthMaxEvents, locale } = useCalendarConfig();
  const { date, visibleEvents } = useCalendarState();

  const dates = useMemo(
    () => getVisibleDaysForMonth(date, weekStartsOn),
    [date, weekStartsOn],
  );

  const eventsByDate = useMemo(
    () => groupEventsByDate(visibleEvents, dates),
    [visibleEvents, dates],
  );

  const orderedWeekdays = useMemo(
    () => getWeekdayLabels(weekStartsOn, 'short', locale),
    [weekStartsOn, locale],
  );

  const today = useCurrentTime();
  const currentMonth = date.getMonth();

  return (
    <div className={styles.monthView}>
      <div className={styles.weekdayHeader}>
        {orderedWeekdays.map((label) => (
          <span key={label} data-testid="weekday-header">{label}</span>
        ))}
      </div>
      <div className={styles.grid}>
        {dates.map((d) => {
          const key = getDateKey(d);
          return (
            <DayCell
              key={key}
              date={d}
              events={eventsByDate.get(key) ?? []}
              isToday={isSameDay(d, today)}
              isOutsideMonth={d.getMonth() !== currentMonth}
              maxEvents={monthMaxEvents}
            />
          );
        })}
      </div>
    </div>
  );
}
