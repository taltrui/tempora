import { isSameDay } from 'date-fns';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { CalendarEvent } from '../../../types/event.ts';
import { EventChip } from '../event-chip/event-chip.tsx';
import styles from './all-day-row.module.scss';

interface AllDayRowProps {
  dates: Date[];
  events: CalendarEvent[];
  hasSecondaryTimezone?: boolean;
}

export function AllDayRow({ dates, events, hasSecondaryTimezone }: AllDayRowProps) {
  return (
    <div className={styles.allDayRow}>
      {hasSecondaryTimezone && <div className={styles.gutterCell} />}
      <div className={styles.gutterCell}>all-day</div>
      {dates.map((date) => {
        const dayEvents = events.filter(
          (e) => isSameDay(e.start, date) || (e.start <= date && e.end >= date),
        );
        return (
          <div key={date.toISOString()} className={styles.dayCell}>
            <SortableContext items={dayEvents.map(e => `event-chip-move-${e.id}`)} strategy={verticalListSortingStrategy}>
              {dayEvents.map((event) => (
                <EventChip key={event.id} event={event} />
              ))}
            </SortableContext>
          </div>
        );
      })}
    </div>
  );
}
