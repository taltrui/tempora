import { useState, useCallback } from 'react';
import {
  Calendar,
  type CalendarView,
  type ToolbarSlotProps,
  type EventMovePayload,
  type EventResizePayload,
} from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

function MinimalToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  const views: { value: CalendarView; icon: string }[] = [
    { value: 'day', icon: 'D' },
    { value: 'week', icon: 'W' },
    { value: 'month', icon: 'M' },
  ];

  return (
    <div className={s.minimalToolbar}>
      <div className={s.minimalToolbarLeft}>
        <button className={s.minimalToolbarNav} onClick={onPrev} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className={s.minimalToolbarNav} onClick={onNext} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={s.minimalToolbarDate}>{dateLabel}</span>
      </div>
      <div className={s.minimalToolbarRight}>
        <button className={s.minimalToolbarToday} onClick={onToday}>
          Today
        </button>
        <div className={s.minimalToolbarViews}>
          {views.map(v => (
            <button
              key={v.value}
              className={`${s.minimalToolbarViewBtn} ${view === v.value ? s.minimalToolbarViewActive : ''}`}
              onClick={() => onViewChange(v.value)}
            >
              {v.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BoldToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  const views: { value: CalendarView; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'agenda', label: 'List' },
  ];

  return (
    <div className={s.boldToolbar}>
      <h2 className={s.boldToolbarDate}>{dateLabel}</h2>
      <div className={s.boldToolbarActions}>
        <div className={s.boldToolbarNavGroup}>
          <button className={s.boldToolbarArrow} onClick={onPrev} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 13L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={s.boldToolbarTodayBtn} onClick={onToday}>Today</button>
          <button className={s.boldToolbarArrow} onClick={onNext} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 5L11 9L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={s.boldToolbarPills}>
          {views.map(v => (
            <button
              key={v.value}
              className={`${s.boldToolbarPill} ${view === v.value ? s.boldToolbarPillActive : ''}`}
              onClick={() => onViewChange(v.value)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type ToolbarVariant = 'minimal' | 'bold';

export function CustomToolbarSection() {
  const [variant, setVariant] = useState<ToolbarVariant>('minimal');
  const [events, setEvents] = useState(SAMPLE_EVENTS.slice(0, 12));

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

  const toolbars: Record<ToolbarVariant, React.ComponentType<ToolbarSlotProps>> = {
    minimal: MinimalToolbar,
    bold: BoldToolbar,
  };

  return (
    <section className={s.section} id="custom-toolbar">
      <div className={s.sectionEyebrow}>Customization</div>
      <h2 className={s.sectionTitle}>Custom toolbar</h2>
      <p className={s.sectionDesc}>
        Replace the default toolbar with your own design using the{' '}
        <code className={s.inlineCode}>slots.toolbar</code> prop. You receive all navigation
        callbacks and view state as props.
      </p>

      <div className={s.variantPicker}>
        <button
          className={`${s.variantBtn} ${variant === 'minimal' ? s.variantBtnActive : ''}`}
          onClick={() => setVariant('minimal')}
        >
          <span className={s.variantDot} style={{ background: '#3b82f6' }} />
          Minimal
        </button>
        <button
          className={`${s.variantBtn} ${variant === 'bold' ? s.variantBtnActive : ''}`}
          onClick={() => setVariant('bold')}
        >
          <span className={s.variantDot} style={{ background: '#c2410c' }} />
          Bold
        </button>
      </div>

      <div className={s.calendarContainer}>
        <Calendar
          events={events}
          defaultView="week"
          weekStartsOn={1}
          height={480}
          onEventMove={handleEventMove}
          onEventResize={handleEventResize}
          slots={{ toolbar: toolbars[variant] }}
        />
      </div>

      <CodeBlock>{`import { Calendar, type ToolbarSlotProps } from 'tempora';

function MyToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  return (
    <header className="my-toolbar">
      <button onClick={onPrev}>&larr;</button>
      <button onClick={onToday}>Today</button>
      <button onClick={onNext}>&rarr;</button>
      <h2>{dateLabel}</h2>
      <div>
        {['day', 'week', 'month'].map(v => (
          <button key={v} onClick={() => onViewChange(v)} data-active={view === v}>
            {v}
          </button>
        ))}
      </div>
    </header>
  );
}

<Calendar events={events} slots={{ toolbar: MyToolbar }} />`}</CodeBlock>
    </section>
  );
}
