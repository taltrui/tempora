import { useMemo } from 'react';
import type { CalendarEvent } from '../../types/event.ts';
import type { CalendarProps } from '../../types/calendar.ts';
import { useCalendar } from '../../hooks/use-calendar.ts';
import { DEFAULT_WEEK_STARTS_ON, DEFAULT_TIME_GRID_CONFIG, DEFAULT_N_DAYS, DEFAULT_MONTH_MAX_EVENTS } from '../../utils/constants.ts';
import { validateTimeGridConfig, validateEvents } from '../../utils/validate-config.ts';
import { clsx } from '../../utils/clsx.ts';
import { CalendarProvider } from './calendar-provider.tsx';
import { Toolbar } from '../toolbar/toolbar.tsx';
import { WeekView } from '../views/week-view/week-view.tsx';
import { DayView } from '../views/day-view/day-view.tsx';
import { MonthView } from '../views/month-view/month-view.tsx';
import { YearView } from '../views/year-view/year-view.tsx';
import { AgendaView } from '../views/agenda-view/agenda-view.tsx';
import styles from './calendar.module.scss';

export function Calendar<TMeta = Record<string, unknown>>(
  props: CalendarProps<TMeta>,
) {
  const calendarState = useCalendar(props);
  const { view, navigation } = calendarState;
  const weekStartsOn = props.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const timeGridConfig = useMemo(
    () => ({ ...DEFAULT_TIME_GRID_CONFIG, ...props.timeGrid }),
    [props.timeGrid],
  );
  const monthMaxEvents = props.monthMaxEvents ?? DEFAULT_MONTH_MAX_EVENTS;

  validateTimeGridConfig(timeGridConfig);

  if (process.env.NODE_ENV !== 'production') {
    validateEvents(props.events as CalendarEvent[]);
  }

  const style: React.CSSProperties = {
    height: props.height ?? '100%',
    ...props.style,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        navigation.goToPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        navigation.goToNext();
        break;
      case 't':
      case 'T':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          navigation.goToToday();
        }
        break;
    }
  };

  return (
    <div
      className={clsx(styles.calendar, props.className)}
      style={style}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Calendar"
    >
      <CalendarProvider
        calendarState={calendarState}
        weekStartsOn={weekStartsOn}
        timeGridConfig={timeGridConfig}
        monthMaxEvents={monthMaxEvents}
        timezones={props.timezones}
        viewConfig={props.viewConfig}
        locale={props.locale}
        slots={props.slots}
        onEventPress={props.onEventPress}
        onEventDoubleClick={props.onEventDoubleClick}
        onSlotPress={props.onSlotPress}
        onDateClick={props.onDateClick}
        onEventMove={props.onEventMove}
        onEventResize={props.onEventResize}
        onShowMore={props.onShowMore}
        draggableEnabled={props.draggable ?? true}
        resizableEnabled={props.resizable ?? true}
      >
        <Toolbar />
        {view === 'day' && <DayView />}
        {view === 'week' && <WeekView />}
        {view === 'month' && <MonthView />}
        {view === 'n-days' && (
          <WeekView nDays={props.viewConfig?.nDays?.count ?? DEFAULT_N_DAYS} />
        )}
        {view === 'year' && <YearView />}
        {view === 'agenda' && <AgendaView />}
      </CalendarProvider>
    </div>
  );
}
