import { useState, useCallback } from 'react';
import {
  Calendar,
  type EventMovePayload,
  type EventResizePayload,
} from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function DragDropSection() {
  const [events, setEvents] = useState(SAMPLE_EVENTS.slice(0, 8));

  const handleEventMove = useCallback((payload: EventMovePayload) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleEventResize = useCallback((payload: EventResizePayload) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  return (
    <section className={s.section} id="drag-and-drop">
      <div className={s.sectionEyebrow}>Interaction</div>
      <h2 className={s.sectionTitle}>Drag & drop</h2>
      <p className={s.sectionDesc}>
        Events can be moved and resized by dragging. Powered by @dnd-kit with snap-to-grid behavior.
        Try dragging an event or pulling its bottom edge.
      </p>
      <div className={s.calendarContainer}>
        <Calendar
          events={events}
          defaultView="week"
          weekStartsOn={1}
          height={460}
          onEventMove={handleEventMove}
          onEventResize={handleEventResize}
        />
      </div>
      <CodeBlock>{`<Calendar
  events={events}
  draggable={true}   // default
  resizable={true}   // default
  onEventMove={({ event, start, end, allDay }) => {
    setEvents(prev =>
      prev.map(e => (e.id === event.id ? { ...e, start, end, allDay } : e))
    );
  }}
  onEventResize={({ event, start, end }) => {
    setEvents(prev =>
      prev.map(e => (e.id === event.id ? { ...e, start, end } : e))
    );
  }}
/>`}</CodeBlock>
      <div className={s.note}>
        Disable drag-and-drop globally with <code className={s.inlineCode}>draggable={'{false}'}</code> and{' '}
        <code className={s.inlineCode}>resizable={'{false}'}</code>, or per-event by setting these
        properties on individual events.
      </div>
    </section>
  );
}
