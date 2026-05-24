import { format } from 'date-fns';
import type { CalendarEvent } from '../../../types/event.ts';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import styles from './event-block.module.scss';

interface EventBlockContentProps {
  event: CalendarEvent;
}

export function EventBlockContent({ event }: EventBlockContentProps) {
  const { locale } = useCalendarConfig();
  const formatOpts = locale ? { locale } : undefined;
  const startTime = format(event.start, 'h:mm', formatOpts);
  const endTime = format(event.end, 'h:mm a', formatOpts);

  return (
    <>
      <div className={styles.title}>{event.title}</div>
      <div className={styles.time}>
        {startTime} &ndash; {endTime}
      </div>
    </>
  );
}
