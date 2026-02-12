import { useState, useCallback, useRef, useEffect } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { CalendarEvent } from '../types/event.ts';
import { isDragData, type DragData, type DropSlotData } from '../types/dnd.ts';
import type { EventMovePayload } from '../types/callbacks.ts';
import { startOfDay } from 'date-fns';
import { snapToSlot, minutesFromMidnight, dateFromMinutes } from '../utils/time.ts';

interface UseDragEventOptions {
  onEventMove?: (payload: EventMovePayload) => void;
  snapDuration: number;
  slotHeight: number;
  slotDuration: number;
  startHour: number;
}

interface UseDragEventReturn {
  activeEvent: CalendarEvent | null;
  activeEventRect: { width: number; height: number } | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

function resolveDropDate(overData: Record<string, unknown>): Date | null {
  if ('date' in overData) return (overData as DropSlotData).date;
  if ('event' in overData) return startOfDay((overData as DragData).event.start);
  return null;
}

function computeMovePayload(
  event: DragEndEvent,
  options: UseDragEventOptions,
): EventMovePayload | null {
  if (!event.over) return null;

  const dragData = event.active.data.current;
  const overData = event.over.data.current as Record<string, unknown> | undefined;
  if (!isDragData(dragData) || !overData || dragData.type !== 'event-move') return null;

  const dropDate = resolveDropDate(overData);
  if (!dropDate) return null;

  const { snapDuration, slotHeight, slotDuration, startHour } = options;
  const allDay = 'allDay' in overData ? (overData as DropSlotData).allDay : false;
  const duration = dragData.originalEnd.getTime() - dragData.originalStart.getTime();
  const pixelsPerMinute = slotHeight / slotDuration;
  const minuteDelta = event.delta.y / pixelsPerMinute;
  const snappedMinutes = snapToSlot(minutesFromMidnight(dragData.originalStart) + minuteDelta, snapDuration);
  const clampedMinutes = Math.max(snappedMinutes, startHour * 60);

  const newStart = dateFromMinutes(dropDate, clampedMinutes);
  const newEnd = new Date(newStart.getTime() + duration);

  return { event: dragData.event, start: newStart, end: newEnd, allDay };
}

export function useDragEvent(options: UseDragEventOptions): UseDragEventReturn {
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [activeEventRect, setActiveEventRect] = useState<{ width: number; height: number } | null>(null);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    if (isDragData(data) && data.type === 'event-move') {
      setActiveEvent(data.event);

      const dndRect = event.active.rect.current.initial;
      if (dndRect && dndRect.width > 0 && dndRect.height > 0) {
        setActiveEventRect({ width: dndRect.width, height: dndRect.height });
        return;
      }

      const target = event.activatorEvent.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('[role="button"]');
      if (el) {
        setActiveEventRect({ width: el.offsetWidth, height: el.offsetHeight });
        return;
      }

      const { slotHeight, slotDuration } = optionsRef.current;
      const duration = (data.originalEnd.getTime() - data.originalStart.getTime()) / 60000;
      setActiveEventRect({ width: 180, height: (duration / slotDuration) * slotHeight });
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const payload = computeMovePayload(event, optionsRef.current);
    if (payload) optionsRef.current.onEventMove?.(payload);
    setActiveEvent(null);
    setActiveEventRect(null);
  }, []);

  return {
    activeEvent,
    activeEventRect,
    handleDragStart,
    handleDragEnd,
  };
}
