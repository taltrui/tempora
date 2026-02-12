import { useMemo } from 'react';
import { format, isSameDay, addDays, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { useCurrentTime } from '../../../hooks/use-current-time.ts';
import { groupEventsByDate, getDateKey, resolveEventColor } from '../../../utils/event.ts';
import { DEFAULT_AGENDA_LENGTH } from '../../../utils/constants.ts';
import { clsx } from '../../../utils/clsx.ts';
import styles from './agenda-view.module.scss';

export function AgendaView() {
  const { onEventPress, viewConfig } = useCalendarConfig();
  const { date, visibleEvents } = useCalendarState();

  const agendaLength = viewConfig?.agenda?.length ?? DEFAULT_AGENDA_LENGTH;

  const agendaDates = useMemo(() => {
    const start = startOfDay(date);
    const end = endOfDay(addDays(date, agendaLength - 1));
    return eachDayOfInterval({ start, end });
  }, [date, agendaLength]);

  const eventsByDate = useMemo(
    () => groupEventsByDate(visibleEvents, agendaDates),
    [visibleEvents, agendaDates],
  );

  const today = useCurrentTime();

  const dateGroupEntries = useMemo(() => {
    const entries: { date: Date; key: string }[] = [];
    for (const d of agendaDates) {
      const key = getDateKey(d);
      const events = eventsByDate.get(key);
      if (events && events.length > 0) {
        entries.push({ date: d, key });
      }
    }
    return entries;
  }, [agendaDates, eventsByDate]);

  if (dateGroupEntries.length === 0) {
    return (
      <div className={styles.agendaView}>
        <div className={styles.emptyState} data-testid="agenda-empty-state">
          No events in this range.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.agendaView}>
      {dateGroupEntries.map(({ date: groupDate, key }) => {
        const events = eventsByDate.get(key) ?? [];
        const isToday = isSameDay(groupDate, today);

        return (
          <div key={key} className={styles.dateGroup} data-testid="agenda-date-group">
            <div className={styles.dateLabel}>
              <span className={styles.dayOfWeek}>{format(groupDate, 'EEE')}</span>
              <span className={clsx(styles.dateNumber, isToday && styles.today)}>
                {format(groupDate, 'd')}
              </span>
              <span className={styles.monthYear}>{format(groupDate, 'MMMM yyyy')}</span>
            </div>
            <div className={styles.eventsList}>
              {events.map((event) => (
                <div
                  key={event.id}
                  className={styles.agendaEvent}
                  data-testid={`agenda-event-${event.id}`}
                  onClick={(e) => onEventPress?.(event, e)}
                >
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: resolveEventColor(event.color) }}
                    data-testid={`agenda-color-dot-${event.id}`}
                  />
                  <span className={styles.eventTime}>
                    {event.allDay
                      ? 'All day'
                      : `${format(event.start, 'h:mm a')} \u2013 ${format(event.end, 'h:mm a')}`}
                  </span>
                  <span className={styles.eventTitle}>{event.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
