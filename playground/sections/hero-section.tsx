import { useState, useCallback } from 'react';
import {
  Calendar,
  type EventMovePayload,
  type EventResizePayload,
  type SlotPressPayload,
} from '../../src/index.ts';
import { SAMPLE_EVENTS, COLORS, nextId } from '../sample-events.ts';
import s from '../docs.module.scss';

export function HeroSection() {
  const [events, setEvents] = useState(SAMPLE_EVENTS);

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
    <section className={s.hero} id="intro">
      <div className={s.heroInner}>
        <div className={s.heroLeft}>
          <div className={s.heroEyebrow}>
            <span />
            React Calendar Component
          </div>
          <h1 className={s.heroTitle}>
            Time, <em>beautifully</em>
            <br />organized
          </h1>
          <p className={s.heroDesc}>
            A full-featured calendar for React with six views,
            drag-and-drop, custom slots, CSS theming, and end-to-end
            TypeScript generics. Built for apps that take scheduling seriously.
          </p>
          <div className={s.heroCtas}>
            <a href="#installation" className={s.heroBtn}>
              Get Started
            </a>
            <a href="#showcase" className={`${s.heroBtn} ${s.heroBtnSecondary}`}>
              See Examples
            </a>
          </div>
          <div className={s.heroStats}>
            <div className={s.heroStat}>
              <span className={s.heroStatValue}>6</span>
              <span className={s.heroStatLabel}>Built-in views</span>
            </div>
            <div className={s.heroStat}>
              <span className={s.heroStatValue}>11</span>
              <span className={s.heroStatLabel}>Event colors</span>
            </div>
            <div className={s.heroStat}>
              <span className={s.heroStatValue}>7</span>
              <span className={s.heroStatLabel}>Custom slots</span>
            </div>
            <div className={s.heroStat}>
              <span className={s.heroStatValue}>0</span>
              <span className={s.heroStatLabel}>UI dependencies</span>
            </div>
          </div>
        </div>
        <div className={s.heroRight}>
          <div className={s.heroCalendarWrap}>
            <Calendar
              events={events}
              defaultView="week"
              weekStartsOn={1}
              height={540}
              onEventMove={handleEventMove}
              onEventResize={handleEventResize}
              onSlotPress={handleSlotPress}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
