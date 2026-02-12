import type { CalendarEvent } from '../../../types/event.ts';
import { getEventColors } from '../../../utils/event.ts';
import { EventBlockContent } from '../event-block/event-block-content.tsx';
import styles from './drag-overlay-content.module.scss';

interface DragOverlayContentProps {
  event: CalendarEvent;
  width: number;
  height: number;
}

export function DragOverlayContent({ event, width, height }: DragOverlayContentProps) {
  const { bg: bgColor, text: textColor } = getEventColors(event.color);

  return (
    <div
      className={styles.dragOverlay}
      style={{
        backgroundColor: bgColor,
        borderLeftColor: bgColor,
        color: textColor,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <EventBlockContent event={event} />
    </div>
  );
}
