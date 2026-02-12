import { format } from 'date-fns';
import type { CalendarEvent } from '../../../types/event.ts';
import styles from './event-block.module.scss';

interface EventBlockContentProps {
  event: CalendarEvent;
}

export function EventBlockContent({ event }: EventBlockContentProps) {
  const startTime = format(event.start, 'h:mm');
  const endTime = format(event.end, 'h:mm a');

  return (
    <>
      <div className={styles.title}>{event.title}</div>
      <div className={styles.time}>
        {startTime} &ndash; {endTime}
      </div>
    </>
  );
}
