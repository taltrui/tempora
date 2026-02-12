import type { TimeSlot } from '../../../types/datetime.ts';
import styles from './time-grid.module.scss';

interface TimeGutterProps {
  slots: TimeSlot[];
  minutesToPixels: (minutes: number) => number;
  totalHeight: number;
}

export function TimeGutter({ slots, minutesToPixels, totalHeight }: TimeGutterProps) {
  return (
    <div className={styles.gutter} style={{ height: `${totalHeight}px` }}>
      {slots.map((slot) => {
        const isHourMark = slot.start % 60 === 0;
        if (!isHourMark) return null;

        const hourLabel = slot.label.replace(':00 ', ' ');
        const top = minutesToPixels(slot.start);

        return (
          <span
            key={slot.start}
            className={styles.gutterLabel}
            style={{ top: `${top}px` }}
          >
            {slot.start === slots[0].start ? '' : hourLabel}
          </span>
        );
      })}
    </div>
  );
}
