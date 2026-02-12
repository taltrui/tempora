import { memo } from 'react';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import type { CalendarEvent } from '../../../types/event.ts';
import type { DragData } from '../../../types/dnd.ts';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import { resolveEventColor } from '../../../utils/event.ts';
import { clsx } from '../../../utils/clsx.ts';
import styles from './event-chip.module.scss';

interface EventChipProps {
  event: CalendarEvent;
}

function formatChipTime(date: Date): string {
  if (date.getMinutes() === 0) {
    return format(date, 'h a');
  }
  return format(date, 'h:mm a');
}

export const EventChip = memo(function EventChip({ event }: EventChipProps) {
  const { onEventPress, draggableEnabled } = useCalendarConfig();
  const color = resolveEventColor(event.color);

  const isDraggable = (event.draggable !== false) && draggableEnabled;

  const dragData: DragData = {
    type: 'event-move',
    eventId: event.id,
    event,
    originalStart: event.start,
    originalEnd: event.end,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: `event-chip-move-${event.id}`,
    data: dragData,
    disabled: !isDraggable,
    transition: null,
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    e.stopPropagation();
    onEventPress?.(event, e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onEventPress?.(event, e as unknown as React.MouseEvent);
    }
  };

  const ariaLabel = event.allDay
    ? `${event.title}, All day`
    : `${event.title}, ${format(event.start, 'h:mm a')}`;

  const chipStyle: React.CSSProperties = {
    ...(event.allDay && { backgroundColor: color }),
    ...(isDragging && { opacity: 0.4 }),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={clsx(styles.eventChip, event.allDay && styles.allDay, isDragging && styles.dragging)}
      style={chipStyle}
      data-testid="event-chip"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      {event.allDay ? (
        <span className={styles.title}>{event.title}</span>
      ) : (
        <>
          <span
            className={styles.dot}
            style={{ backgroundColor: color }}
            data-testid={`event-chip-dot-${event.id}`}
          />
          <span className={styles.time}>{formatChipTime(event.start)}</span>
          <span className={styles.title}>{event.title}</span>
        </>
      )}
    </div>
  );
});
