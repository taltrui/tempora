import { useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import type { WeekStartsOn } from '../../../types/datetime.ts';
import { getVisibleDaysForMonth, getOrderedWeekdayLabels } from '../../../utils/date.ts';
import { getDateKey } from '../../../utils/event.ts';
import { clsx } from '../../../utils/clsx.ts';
import styles from './mini-calendar.module.scss';

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface MiniCalendarProps {
  month: Date;
  weekStartsOn: WeekStartsOn;
  today: Date;
  onDateClick?: (date: Date) => void;
}

export function MiniCalendar({ month, weekStartsOn, today, onDateClick }: MiniCalendarProps) {
  const days = useMemo(
    () => getVisibleDaysForMonth(month, weekStartsOn),
    [month, weekStartsOn],
  );

  const orderedWeekdays = useMemo(
    () => getOrderedWeekdayLabels(WEEKDAY_LETTERS, weekStartsOn),
    [weekStartsOn],
  );

  const currentMonth = month.getMonth();

  return (
    <div className={styles.miniCalendar} data-testid={`mini-calendar-${currentMonth}`}>
      <div className={styles.monthTitle}>{format(month, 'MMMM')}</div>
      <div className={styles.weekdayRow} data-testid="mini-weekday-row">
        {orderedWeekdays.map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </div>
      <div className={styles.daysGrid}>
        {days.map((d) => {
          const key = getDateKey(d);
          const isOutsideMonth = d.getMonth() !== currentMonth;
          const isToday = isSameDay(d, today);

          return (
            <button
              key={key}
              data-testid={`mini-day-${key}`}
              className={clsx(
                styles.day,
                isToday && styles.today,
                isOutsideMonth && styles.outside,
              )}
              onClick={() => onDateClick?.(d)}
            >
              {format(d, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
