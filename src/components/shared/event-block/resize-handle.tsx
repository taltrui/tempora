import { useDraggable } from '@dnd-kit/core';
import type { CalendarEvent } from '../../../types/event.ts';
import type { DragData } from '../../../types/dnd.ts';
import styles from './event-block.module.scss';

interface ResizeHandleProps {
  event: CalendarEvent;
  position: 'top' | 'bottom';
}

export function ResizeHandle({ event, position }: ResizeHandleProps) {
  const dragData: DragData = {
    type: position === 'top' ? 'event-resize-top' : 'event-resize-bottom',
    eventId: event.id,
    event,
    originalStart: event.start,
    originalEnd: event.end,
  };

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `event-resize-${position}-${event.id}`,
    data: dragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={styles.resizeHandle}
      data-position={position}
    />
  );
}
