import { startOfDay, addMinutes, format } from 'date-fns';
import type { TimeSlot, TimeGridConfig } from '../types/datetime.ts';

export function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function dateFromMinutes(baseDate: Date, minutes: number): Date {
  return addMinutes(startOfDay(baseDate), minutes);
}

export function snapToSlot(minutes: number, snapDuration: number): number {
  return Math.round(minutes / snapDuration) * snapDuration;
}

export function eachSlotOfDay(startHour: number, endHour: number, slotDuration: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;
  const refDate = new Date(2000, 0, 1);

  for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
    const slotDate = addMinutes(startOfDay(refDate), minutes);
    slots.push({
      start: minutes,
      end: minutes + slotDuration,
      label: format(slotDate, 'h:mm a'),
    });
  }

  return slots;
}

export function timeToGridPosition(date: Date, config: TimeGridConfig): number {
  const minutes = minutesFromMidnight(date);
  return (minutes - config.startHour * 60) * (config.slotHeight / config.slotDuration);
}
