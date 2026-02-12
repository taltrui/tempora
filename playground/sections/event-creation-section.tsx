import { useState, useCallback } from 'react';
import { Calendar, type SlotPressPayload } from '../../src/index.ts';
import { SAMPLE_EVENTS, COLORS, nextId } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function EventCreationSection() {
  const [events, setEvents] = useState(SAMPLE_EVENTS.slice(0, 5));

  const handleSlotPress = useCallback((payload: SlotPressPayload) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setEvents(prev => [
      ...prev,
      {
        id: String(nextId()),
        title: 'New Event',
        start: payload.start,
        end: payload.end,
        allDay: payload.allDay,
        color,
      },
    ]);
  }, []);

  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="event-creation">
      <div className={s.sectionEyebrow}>Interaction</div>
      <h2 className={s.sectionTitle}>Click to create</h2>
      <p className={s.sectionDesc}>
        Use the <code className={s.inlineCode}>onSlotPress</code> callback to create events
        when users click empty time slots. Try clicking an empty slot below.
      </p>
      <div className={s.calendarContainer}>
        <Calendar
          events={events}
          defaultView="week"
          weekStartsOn={1}
          height={460}
          onSlotPress={handleSlotPress}
        />
      </div>
      <CodeBlock>{`<Calendar
  events={events}
  onSlotPress={({ start, end, allDay }) => {
    setEvents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: 'New event',
        start,
        end,
        allDay,
      },
    ]);
  }}
/>`}</CodeBlock>
    </section>
  );
}
