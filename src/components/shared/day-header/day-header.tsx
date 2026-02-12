import { format } from 'date-fns';
import { clsx } from '../../../utils/clsx.ts';
import styles from './day-header.module.scss';

interface DayHeaderProps {
  date: Date;
  isToday: boolean;
}

export function DayHeader({ date, isToday }: DayHeaderProps) {
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
