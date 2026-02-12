import { useState } from 'react';
import { Calendar, type CalendarView } from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function ControlledSection() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [events] = useState(SAMPLE_EVENTS);

  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="controlled">
      <div className={s.sectionEyebrow}>State</div>
      <h2 className={s.sectionTitle}>Controlled mode</h2>
      <p className={s.sectionDesc}>
        Manage date and view state externally by passing{' '}
        <code className={s.inlineCode}>date</code>,{' '}
        <code className={s.inlineCode}>view</code>,{' '}
        <code className={s.inlineCode}>onDateChange</code>, and{' '}
        <code className={s.inlineCode}>onViewChange</code> props.
      </p>
      <div className={s.controlsRow}>
        <label className={s.controlLabel}>
          Date:
          <input
            type="date"
            className={s.controlInput}
            value={date.toISOString().split('T')[0]}
            onChange={e => setDate(new Date(e.target.value + 'T12:00:00'))}
          />
        </label>
        <label className={s.controlLabel}>
          View:
          <select
            className={s.controlInput}
            value={view}
            onChange={e => setView(e.target.value as CalendarView)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="agenda">Agenda</option>
          </select>
        </label>
      </div>
      <div className={s.calendarContainer}>
        <Calendar
          events={events}
          date={date}
          view={view}
          onDateChange={setDate}
          onViewChange={setView}
          weekStartsOn={1}
          height={460}
        />
      </div>
      <CodeBlock>{`const [date, setDate] = useState(new Date());
const [view, setView] = useState<CalendarView>('week');

<Calendar
  events={events}
  date={date}
  view={view}
  onDateChange={setDate}
  onViewChange={setView}
/>`}</CodeBlock>
    </section>
  );
}
