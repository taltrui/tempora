import { useRef, useEffect } from 'react';
import { isToday as isTodayFn, isSameDay } from 'date-fns';
import type { CalendarEvent } from '../../../types/event.ts';
import type { TimeGridConfig, TimeSlot } from '../../../types/datetime.ts';
import { useTimeGrid } from '../../../hooks/use-time-grid.ts';
import { useEventLayout } from '../../../hooks/use-event-layout.ts';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import { DayHeader } from '../day-header/day-header.tsx';
import { TimeGutter } from './time-gutter.tsx';
import { TimezoneGutter } from './timezone-gutter.tsx';
import { AllDayRow } from '../all-day-row/all-day-row.tsx';
import { TimeColumn } from './time-column.tsx';
import styles from './time-grid.module.scss';

interface TimeGridProps {
  dates: Date[];
  events: CalendarEvent[];
  config: TimeGridConfig;
}

function EventsForDay({
  date,
  events,
  config,
  slots,
  totalHeight,
  minutesToPixels,
}: {
  date: Date;
  events: CalendarEvent[];
  config: TimeGridConfig;
  slots: TimeSlot[];
  totalHeight: number;
  minutesToPixels: (minutes: number) => number;
}) {
  const layoutedEvents = useEventLayout(events, date, config);

  return (
    <TimeColumn
      date={date}
      events={layoutedEvents}
      slots={slots}
      slotHeight={config.slotHeight}
      totalHeight={totalHeight}
      isToday={isTodayFn(date)}
      minutesToPixels={minutesToPixels}
    />
  );
}

export function TimeGrid({ dates, events, config }: TimeGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { slots, totalHeight, minutesToPixels } = useTimeGrid(config);
  const { timezones } = useCalendarConfig();

  const allDayEvents: CalendarEvent[] = [];
  const timedEvents: CalendarEvent[] = [];
  for (const e of events) {
    (e.allDay ? allDayEvents : timedEvents).push(e);
  }
  const hasSecondaryTimezone = !!timezones?.secondary;

  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = minutesToPixels(8 * 60);
      scrollRef.current.scrollTop = scrollTo;
    }
  }, [minutesToPixels]);

  return (
    <div className={styles.timeGrid} role="grid" aria-label="Calendar time grid">
      <div className={styles.headerRow} role="row">
        {hasSecondaryTimezone && <div className={styles.gutterHeader} />}
        <div className={styles.gutterHeader} />
        {dates.map((date) => (
          <div key={date.toISOString()} className={styles.headerCell} role="columnheader">
            <DayHeader date={date} isToday={isTodayFn(date)} />
          </div>
        ))}
      </div>
      {allDayEvents.length > 0 && (
        <AllDayRow dates={dates} events={allDayEvents} hasSecondaryTimezone={hasSecondaryTimezone} />
      )}
      <div className={styles.scrollContainer} ref={scrollRef}>
        {hasSecondaryTimezone && (
          <TimezoneGutter
            timezone={timezones!.secondary!}
            slots={slots}
            totalHeight={totalHeight}
            minutesToPixels={minutesToPixels}
          />
        )}
        <TimeGutter
          slots={slots}
          minutesToPixels={minutesToPixels}
          totalHeight={totalHeight}
        />
        <div className={styles.columns}>
          {dates.map((date) => {
            const dayEvents = timedEvents.filter(
              (e) => isSameDay(e.start, date) || isSameDay(e.end, date) || (e.start < date && e.end > date),
            );
            return (
              <EventsForDay
                key={date.toISOString()}
                date={date}
                events={dayEvents}
                config={config}
                slots={slots}
                totalHeight={totalHeight}
                minutesToPixels={minutesToPixels}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
