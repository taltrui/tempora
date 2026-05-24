import { format } from 'date-fns';
import type { TimeSlot } from '../../../types/datetime.ts';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import styles from './time-grid.module.scss';

interface TimeGutterProps {
  timeSlots: TimeSlot[];
  minutesToPixels: (minutes: number) => number;
  totalHeight: number;
}

export function TimeGutter({ timeSlots, minutesToPixels, totalHeight }: TimeGutterProps) {
  const { slots, locale } = useCalendarConfig();
  const formatOpts = locale ? { locale } : undefined;
  const refDate = new Date();
  refDate.setHours(0, 0, 0, 0);

  return (
    <div className={styles.gutter} style={{ height: `${totalHeight}px` }}>
      {timeSlots.map((slot) => {
        const isHourMark = slot.start % 60 === 0;
        if (!isHourMark) return null;

        const top = minutesToPixels(slot.start);
        const isFirst = slot.start === timeSlots[0].start;

        const slotDate = new Date(refDate);
        slotDate.setMinutes(slot.start);

        if (slots?.timeGutterLabel && !isFirst) {
          return (
            <span key={slot.start} className={styles.gutterLabel} style={{ top: `${top}px` }}>
              <slots.timeGutterLabel time={slotDate} />
            </span>
          );
        }

        return (
          <span
            key={slot.start}
            className={styles.gutterLabel}
            style={{ top: `${top}px` }}
          >
            {isFirst ? '' : format(slotDate, 'h a', formatOpts)}
          </span>
        );
      })}
    </div>
  );
}
