import { useMemo, useCallback } from 'react';
import type { TimeGridConfig, TimeSlot } from '../types/datetime.ts';
import { eachSlotOfDay } from '../utils/time.ts';

export interface UseTimeGridReturn {
  slots: TimeSlot[];
  totalHeight: number;
  minutesToPixels: (minutes: number) => number;
  pixelsToMinutes: (pixels: number) => number;
}

export function useTimeGrid(config: TimeGridConfig): UseTimeGridReturn {
  const { startHour, endHour, slotDuration, slotHeight } = config;

  const slots = useMemo(
    () => eachSlotOfDay(startHour, endHour, slotDuration),
    [startHour, endHour, slotDuration],
  );

  const totalHeight = ((endHour - startHour) * 60 / slotDuration) * slotHeight;
  const pixelsPerMinute = slotHeight / slotDuration;
  const gridStartMinutes = startHour * 60;

  const minutesToPixels = useCallback(
    (minutes: number) => (minutes - gridStartMinutes) * pixelsPerMinute,
    [gridStartMinutes, pixelsPerMinute],
  );

  const pixelsToMinutes = useCallback(
    (pixels: number) => pixels / pixelsPerMinute + gridStartMinutes,
    [gridStartMinutes, pixelsPerMinute],
  );

  return { slots, totalHeight, minutesToPixels, pixelsToMinutes };
}
