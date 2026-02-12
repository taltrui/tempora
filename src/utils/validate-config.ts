import type { TimeGridConfig } from '../types/datetime.ts';
import type { CalendarEvent } from '../types/event.ts';

export function validateEvents(events: CalendarEvent[]): void {
  for (const event of events) {
    if (!(event.start instanceof Date) || isNaN(event.start.getTime())) {
      console.warn(
        `[Tempora] Event "${event.id}" has an invalid start date. ` +
        'Ensure all event dates are valid Date instances.',
      );
    }
    if (!(event.end instanceof Date) || isNaN(event.end.getTime())) {
      console.warn(
        `[Tempora] Event "${event.id}" has an invalid end date. ` +
        'Ensure all event dates are valid Date instances.',
      );
    }
    if (
      event.start instanceof Date &&
      event.end instanceof Date &&
      !isNaN(event.start.getTime()) &&
      !isNaN(event.end.getTime()) &&
      event.start > event.end
    ) {
      console.warn(
        `[Tempora] Event "${event.id}" has start after end ` +
        `(${event.start.toISOString()} > ${event.end.toISOString()}).`,
      );
    }
  }
}

export function validateTimeGridConfig(config: TimeGridConfig): void {
  if (config.slotDuration <= 0) {
    throw new Error(
      `[Tempora] Invalid slotDuration: ${config.slotDuration}. Must be greater than 0.`,
    );
  }
  if (config.slotHeight <= 0) {
    throw new Error(
      `[Tempora] Invalid slotHeight: ${config.slotHeight}. Must be greater than 0.`,
    );
  }
  if (config.snapDuration <= 0) {
    throw new Error(
      `[Tempora] Invalid snapDuration: ${config.snapDuration}. Must be greater than 0.`,
    );
  }
  if (config.startHour >= config.endHour) {
    throw new Error(
      `[Tempora] Invalid time range: startHour (${config.startHour}) must be less than endHour (${config.endHour}).`,
    );
  }
}
