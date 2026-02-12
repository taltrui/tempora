import { format } from 'date-fns';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { CalendarEvent } from '../../../types/event.ts';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { getDateKey } from '../../../utils/event.ts';
import { clsx } from '../../../utils/clsx.ts';
import { EventChip } from '../event-chip/event-chip.tsx';
import styles from './day-cell.module.scss';

interface DayCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isOutsideMonth: boolean;
  maxEvents: number;
}

export function DayCell({ date, events, isToday, isOutsideMonth, maxEvents }: DayCellProps) {
  const { onDateClick, onShowMore, slots } = useCalendarConfig();
  const { view } = useCalendarState();
  const dateKey = getDateKey(date);

  if (slots?.dayCell) {
    const DayCellSlot = slots.dayCell;
    return <DayCellSlot date={date} events={events} isToday={isToday} isOutsideMonth={isOutsideMonth} />;
  }

  const visibleEvents = events.slice(0, maxEvents);
  const remainingCount = events.length - maxEvents;

  const handleDateClick = () => {
    onDateClick?.(date, view);
  };

  const handleShowMore = () => {
    onShowMore?.(date, events);
  };

  return (
    <div className={styles.dayCell} data-testid="day-cell">
      <button
        className={clsx(styles.dateNumber, isToday && styles.today, isOutsideMonth && styles.outside)}
        onClick={handleDateClick}
        data-testid={`date-number-${dateKey}`}
        aria-current={isToday ? 'date' : undefined}
      >
        {format(date, 'd')}
      </button>
      <div className={styles.events}>
        <SortableContext items={visibleEvents.map(e => `event-chip-move-${e.id}`)} strategy={verticalListSortingStrategy}>
          {visibleEvents.map((event) => (
            <EventChip key={event.id} event={event} />
          ))}
        </SortableContext>
        {remainingCount > 0 && (
          slots?.showMoreButton ? (
            <slots.showMoreButton date={date} count={remainingCount} events={events} />
          ) : (
            <button className={styles.showMore} onClick={handleShowMore}>
              +{remainingCount} more
            </button>
          )
        )}
      </div>
    </div>
  );
}
