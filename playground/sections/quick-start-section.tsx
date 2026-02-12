import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function QuickStartSection() {
  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="quick-start">
      <h2 className={s.sectionTitle}>Quick Start</h2>
      <p className={s.sectionDesc}>
        Import the Calendar component and its stylesheet, pass your events, and you're ready.
      </p>
      <CodeBlock>{`import { useState } from 'react';
import { Calendar, CalendarEvent } from 'tempora';
import 'tempora/style.css';

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team standup',
    start: new Date(2026, 0, 12, 9, 0),
    end: new Date(2026, 0, 12, 9, 30),
    color: 'peacock',
  },
];

function App() {
  const [myEvents, setMyEvents] = useState(events);

  return (
    <Calendar
      events={myEvents}
      defaultView="week"
      onEventMove={({ event, start, end }) => {
        setMyEvents(prev =>
          prev.map(e => (e.id === event.id ? { ...e, start, end } : e))
        );
      }}
    />
  );
}`}</CodeBlock>
    </section>
  );
}
