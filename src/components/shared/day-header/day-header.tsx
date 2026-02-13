import { format } from 'date-fns';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import { useCalendarState } from '../../../context/calendar-context.ts';
import { clsx } from '../../../utils/clsx.ts';
import styles from './day-header.module.scss';

interface DayHeaderProps {
  date: Date;
  isToday: boolean;
}

export function DayHeader({ date, isToday }: DayHeaderProps) {
  const { slots } = useCalendarConfig();
  const { view } = useCalendarState();

  if (slots?.dayHeader) {
    return <slots.dayHeader date={date} isToday={isToday} view={view} />;
  }

  return (
    <div
      className={clsx(styles.dayHeader, isToday && styles.today)}
      data-testid="day-header"
    >
      <span className={styles.dayName}>{format(date, 'EEE')}</span>
      <span className={styles.dayNumber}>{format(date, 'd')}</span>
    </div>
  );
}
