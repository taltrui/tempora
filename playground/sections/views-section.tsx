import { useState } from 'react';
import { Calendar, type CalendarView } from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import s from '../docs.module.scss';

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'agenda', label: 'Agenda' },
  { value: 'n-days', label: '4 Days' },
];

export function ViewsSection() {
  const [view, setView] = useState<CalendarView>('week');
  const [date, setDate] = useState(new Date());
  const [events] = useState(SAMPLE_EVENTS);

  return (
    <section className={s.section} id="views">
      <div className={s.sectionEyebrow}>Views</div>
      <h2 className={s.sectionTitle}>Six ways to see your time</h2>
      <p className={s.sectionDesc}>
        Switch between day, week, month, year, agenda, and n-day views. Each is fully
        interactive with drag-and-drop, event creation, and keyboard navigation.
      </p>
      <div className={s.viewButtons}>
        {VIEWS.map(v => (
          <button
            key={v.value}
            className={`${s.viewBtn} ${view === v.value ? s.viewBtnActive : ''}`}
            onClick={() => setView(v.value)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className={s.calendarContainer}>
        <Calendar
          events={events}
          view={view}
          date={date}
          onViewChange={setView}
          onDateChange={setDate}
          weekStartsOn={1}
          height={520}
        />
      </div>
    </section>
  );
}
