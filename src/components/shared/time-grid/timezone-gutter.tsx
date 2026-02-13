import type { TimeSlot } from '../../../types/datetime.ts';
import { useCalendarConfig } from '../../../context/calendar-context.ts';
import styles from './time-grid.module.scss';

interface TimezoneGutterProps {
  timezone: string;
  timeSlots: TimeSlot[];
  totalHeight: number;
  minutesToPixels: (minutes: number) => number;
}

function formatTimeInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone,
    }).format(date);
  } catch {
    return '';
  }
}

function getTimezoneAbbr(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: timezone,
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone;
  } catch {
    return timezone;
  }
}

export function TimezoneGutter({ timezone, timeSlots, totalHeight, minutesToPixels }: TimezoneGutterProps) {
  const { slots } = useCalendarConfig();
  const abbr = getTimezoneAbbr(timezone);
  const refDate = new Date();
  refDate.setHours(0, 0, 0, 0);

  return (
    <div
      className={styles.timezoneGutter}
      style={{ height: `${totalHeight}px` }}
      data-testid="timezone-gutter"
    >
      <span className={styles.timezoneAbbr}>{abbr}</span>
      {timeSlots.map((slot) => {
        const isHourMark = slot.start % 60 === 0;
        if (!isHourMark) return null;

        const slotDate = new Date(refDate);
        slotDate.setMinutes(slot.start);
        const top = minutesToPixels(slot.start);
        const isFirst = slot.start === timeSlots[0].start;

        if (slots?.timeGutterLabel && !isFirst) {
          return (
            <span key={slot.start} className={styles.gutterLabel} style={{ top: `${top}px` }}>
              <slots.timeGutterLabel time={slotDate} timezone={timezone} />
            </span>
          );
        }

        const label = formatTimeInTimezone(slotDate, timezone);

        return (
          <span
            key={slot.start}
            className={styles.gutterLabel}
            style={{ top: `${top}px` }}
          >
            {isFirst ? '' : label}
          </span>
        );
      })}
    </div>
  );
}
