import { useCallback, useRef, useEffect } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { isDragData } from '../types/dnd.ts';
import type { EventResizePayload } from '../types/callbacks.ts';
import { snapToSlot, minutesFromMidnight, dateFromMinutes } from '../utils/time.ts';

interface UseResizeEventOptions {
  onEventResize?: (payload: EventResizePayload) => void;
  snapDuration: number;
  slotHeight: number;
  slotDuration: number;
  startHour: number;
  endHour: number;
}

interface UseResizeEventReturn {
  handleResizeDragEnd: (event: DragEndEvent) => void;
}

export function useResizeEvent(options: UseResizeEventOptions): UseResizeEventReturn {
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const handleResizeDragEnd = useCallback((event: DragEndEvent) => {
    const { onEventResize, snapDuration, slotHeight, slotDuration, startHour, endHour } =
      optionsRef.current;

    const dragData = event.active.data.current;
    if (
      !isDragData(dragData) ||
      (dragData.type !== 'event-resize-top' && dragData.type !== 'event-resize-bottom')
    ) {
      return;
    }

    const pixelsPerMinute = slotHeight / slotDuration;
    const minuteDelta = event.delta.y / pixelsPerMinute;
    const minMinutes = startHour * 60;
    const maxMinutes = endHour * 60;

    const isBottom = dragData.type === 'event-resize-bottom';
    const movingDate = isBottom ? dragData.originalEnd : dragData.originalStart;
    const anchorMinutes = minutesFromMidnight(isBottom ? dragData.originalStart : dragData.originalEnd);

    const snappedMinutes = snapToSlot(minutesFromMidnight(movingDate) + minuteDelta, snapDuration);
    const lowerBound = isBottom ? anchorMinutes + snapDuration : minMinutes;
    const upperBound = isBottom ? maxMinutes : anchorMinutes - snapDuration;
    const clampedMinutes = Math.max(Math.min(snappedMinutes, upperBound), lowerBound);

    const newDate = dateFromMinutes(movingDate, clampedMinutes);

    onEventResize?.({
      event: dragData.event,
      start: isBottom ? dragData.originalStart : newDate,
      end: isBottom ? newDate : dragData.originalEnd,
    });
  }, []);

  return { handleResizeDragEnd };
}
