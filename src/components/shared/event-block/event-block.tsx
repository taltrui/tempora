import { memo, useState } from 'react';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { useDndMonitor } from '@dnd-kit/core';
import type { LayoutedEvent } from '../../../utils/layout.ts';
import type { DragData } from '../../../types/dnd.ts';
import { isDragData } from '../../../types/dnd.ts';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import { useCalendarState } from '../../../context/calendar-context.ts';
import { getEventColors } from '../../../utils/event.ts';
import { clsx } from '../../../utils/clsx.ts';
import { EventBlockContent } from './event-block-content.tsx';
import { ResizeHandle } from './resize-handle.tsx';
import styles from './event-block.module.scss';

interface EventBlockProps {
  layoutedEvent: LayoutedEvent;
}

export const EventBlock = memo(function EventBlock({ layoutedEvent }: EventBlockProps) {
  const { onEventPress, onEventDoubleClick, draggableEnabled, resizableEnabled, timeGridConfig, slots } = useCalendarConfig();
  const { view } = useCalendarState();
  const { event, column, totalColumns, top, height } = layoutedEvent;
  const { bg: bgColor, text: textColor } = getEventColors(event.color);

  const isDraggable = (event.draggable !== false) && draggableEnabled;
  const isResizable = (event.resizable !== false) && resizableEnabled;

  const dragData: DragData = {
    type: 'event-move',
    eventId: event.id,
    event,
    originalStart: event.start,
    originalEnd: event.end,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: `event-move-${event.id}`,
    data: dragData,
    disabled: !isDraggable,
    transition: null,
  });

  const [resizeDelta, setResizeDelta] = useState(0);
  const [resizeType, setResizeType] = useState<'top' | 'bottom' | null>(null);

  useDndMonitor({
    onDragStart(dragEvent) {
      const data = dragEvent.active.data.current;
      if (!isDragData(data) || data.eventId !== event.id) return;
      if (data.type === 'event-resize-top') setResizeType('top');
      else if (data.type === 'event-resize-bottom') setResizeType('bottom');
    },
    onDragMove(dragEvent) {
      const data = dragEvent.active.data.current;
      if (!isDragData(data) || data.eventId !== event.id) return;
      if (data.type === 'event-resize-top' || data.type === 'event-resize-bottom') {
        setResizeDelta(dragEvent.delta.y);
      }
    },
    onDragEnd() {
      setResizeDelta(0);
      setResizeType(null);
    },
    onDragCancel() {
      setResizeDelta(0);
      setResizeType(null);
    },
  });

  const { slotHeight, slotDuration, snapDuration } = timeGridConfig;
  const snapPixels = (snapDuration / slotDuration) * slotHeight;
  const snappedDelta = Math.round(resizeDelta / snapPixels) * snapPixels;

  let visualTop = top;
  let visualHeight = height;

  if (resizeType === 'bottom') {
    visualHeight = Math.max(snapPixels, height + snappedDelta);
  } else if (resizeType === 'top') {
    const maxTopDelta = height - snapPixels;
    const clampedDelta = Math.min(snappedDelta, maxTopDelta);
    visualTop = top + clampedDelta;
    visualHeight = Math.max(snapPixels, height - clampedDelta);
  }

  const isResizing = resizeType !== null;
  const colWidth = 100 / totalColumns;
  const left = column * colWidth;
  const isLastColumn = column === totalColumns - 1;
  const width = isLastColumn ? colWidth * 0.92 : colWidth;

  const style: React.CSSProperties = {
    top: `${visualTop}px`,
    height: `${visualHeight}px`,
    left: `${left}%`,
    width: `calc(${width}% - 2px)`,
    backgroundColor: bgColor,
    borderLeftColor: bgColor,
    color: textColor,
    opacity: isDragging ? 0.4 : 1,
    ...(isResizing && { zIndex: 10, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }),
  };

  const ariaLabel = `${event.title}, ${format(event.start, 'h:mm a')} to ${format(event.end, 'h:mm a')}`;

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    e.stopPropagation();
    onEventPress?.(event, e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    onEventDoubleClick?.(event, e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onEventPress?.(event, e as unknown as React.MouseEvent);
    }
  };

  const block = (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={clsx(styles.eventBlock, isDragging && styles.dragging, isResizing && styles.resizing)}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      {isResizable && <ResizeHandle event={event} position="top" />}
      {slots?.eventContent ? <slots.eventContent event={event} view={view} /> : <EventBlockContent event={event} />}
      {isResizable && <ResizeHandle event={event} position="bottom" />}
    </div>
  );

  if (slots?.eventWrapper) {
    return <slots.eventWrapper event={event}>{block}</slots.eventWrapper>;
  }

  return block;
});
