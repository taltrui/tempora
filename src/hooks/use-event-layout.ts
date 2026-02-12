import { useMemo } from 'react';
import type { CalendarEvent } from '../types/event.ts';
import type { TimeGridConfig } from '../types/datetime.ts';
import { computeEventLayout, type LayoutedEvent } from '../utils/layout.ts';

export function useEventLayout<TMeta>(
  events: CalendarEvent<TMeta>[],
  date: Date,
  config: TimeGridConfig,
): LayoutedEvent<TMeta>[] {
  return useMemo(
    () => computeEventLayout(events, date, config),
    [events, date, config],
  );
}
