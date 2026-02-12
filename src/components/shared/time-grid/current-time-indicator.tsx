import { useCurrentTime } from '../../../hooks/use-current-time.ts';
import { minutesFromMidnight } from '../../../utils/time.ts';
import styles from './time-grid.module.scss';

interface CurrentTimeIndicatorProps {
  minutesToPixels: (minutes: number) => number;
}

export function CurrentTimeIndicator({ minutesToPixels }: CurrentTimeIndicatorProps) {
  const now = useCurrentTime();
  const top = minutesToPixels(minutesFromMidnight(now));

  return (
    <div
      className={styles.currentTimeIndicator}
      style={{ top: `${top}px` }}
      data-testid="current-time-indicator"
    >
      <div className={styles.currentTimeDot} />
      <div className={styles.currentTimeLine} />
    </div>
  );
}
