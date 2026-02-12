import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Calendar,
  type CalendarEvent,
  type SlotPressPayload,
  type EventMovePayload,
  type EventResizePayload,
  type EventColor,
} from '../../src/index.ts';
import { SAMPLE_EVENTS, COLORS, nextId } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

interface PopoverState {
  open: boolean;
  x: number;
  y: number;
}

interface CreationPopoverState extends PopoverState {
  start: Date;
  end: Date;
  allDay: boolean;
}

interface DetailPopoverState extends PopoverState {
  event: CalendarEvent | null;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, onClose]);
}

function CreationDemo() {
  const [events, setEvents] = useState(SAMPLE_EVENTS.slice(0, 8));
  const [popover, setPopover] = useState<CreationPopoverState>({
    open: false, x: 0, y: 0, start: new Date(), end: new Date(), allDay: false,
  });
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<EventColor>('blueberry');
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, () => setPopover(p => ({ ...p, open: false })));

  const handleSlotPress = useCallback((payload: SlotPressPayload) => {
    const calendarEl = document.querySelector(`[id="popover-creation-demo"]`);
    const rect = calendarEl?.getBoundingClientRect();
    if (!rect) return;

    setTitle('');
    setColor('blueberry');
    setPopover({
      open: true,
      x: Math.min(rect.width - 300, Math.max(0, (rect.width / 2) - 150)),
      y: Math.min(rect.height - 200, Math.max(40, (rect.height / 2) - 100)),
      start: payload.start,
      end: payload.end,
      allDay: payload.allDay,
    });
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;
    setEvents(prev => [
      ...prev,
      {
        id: String(nextId()),
        title: title.trim(),
        start: popover.start,
        end: popover.end,
        allDay: popover.allDay,
        color,
      },
    ]);
    setPopover(p => ({ ...p, open: false }));
  };

  const handleMove = useCallback((payload: EventMovePayload) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleResize = useCallback((payload: EventResizePayload) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  return (
    <div className={s.popoverDemoWrap} id="popover-creation-demo" style={{ position: 'relative' }}>
      <Calendar
        events={events}
        defaultView="week"
        weekStartsOn={1}
        height={480}
        onSlotPress={handleSlotPress}
        onEventMove={handleMove}
        onEventResize={handleResize}
      />
      {popover.open && (
        <div
          ref={popoverRef}
          className={s.popover}
          style={{ left: popover.x, top: popover.y }}
        >
          <div className={s.popoverHeader}>
            <span className={s.popoverTitle}>New event</span>
            <button
              className={s.popoverClose}
              onClick={() => setPopover(p => ({ ...p, open: false }))}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className={s.popoverTime}>
            {formatDate(popover.start)} &middot; {formatTime(popover.start)} &ndash; {formatTime(popover.end)}
          </div>
          <input
            className={s.popoverInput}
            placeholder="Event title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <div className={s.popoverColors}>
            {COLORS.slice(0, 8).map(c => (
              <button
                key={c}
                className={`${s.popoverColorBtn} ${color === c ? s.popoverColorActive : ''}`}
                onClick={() => setColor(c)}
                aria-label={c}
              >
                <span className={s.popoverColorDot} data-color={c} />
              </button>
            ))}
          </div>
          <div className={s.popoverActions}>
            <button
              className={s.popoverCancelBtn}
              onClick={() => setPopover(p => ({ ...p, open: false }))}
            >
              Cancel
            </button>
            <button
              className={s.popoverSaveBtn}
              onClick={handleSave}
              disabled={!title.trim()}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailDemo() {
  const [events, setEvents] = useState(SAMPLE_EVENTS.slice(0, 12));
  const [popover, setPopover] = useState<DetailPopoverState>({
    open: false, x: 0, y: 0, event: null,
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, () => setPopover(p => ({ ...p, open: false })));

  const handleEventPress = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    const calendarEl = document.querySelector(`[id="popover-detail-demo"]`);
    const rect = calendarEl?.getBoundingClientRect();
    if (!rect) return;

    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    setPopover({
      open: true,
      x: Math.min(rect.width - 280, Math.max(0, relX - 140)),
      y: Math.min(rect.height - 180, Math.max(40, relY + 10)),
      event,
    });
  }, []);

  const handleDelete = () => {
    if (!popover.event) return;
    setEvents(prev => prev.filter(e => e.id !== popover.event!.id));
    setPopover(p => ({ ...p, open: false }));
  };

  const handleMove = useCallback((payload: EventMovePayload) => {
    setPopover(p => ({ ...p, open: false }));
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleResize = useCallback((payload: EventResizePayload) => {
    setPopover(p => ({ ...p, open: false }));
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  return (
    <div className={s.popoverDemoWrap} id="popover-detail-demo" style={{ position: 'relative' }}>
      <Calendar
        events={events}
        defaultView="week"
        weekStartsOn={1}
        height={480}
        onEventPress={handleEventPress}
        onEventMove={handleMove}
        onEventResize={handleResize}
      />
      {popover.open && popover.event && (
        <div
          ref={popoverRef}
          className={s.popover}
          style={{ left: popover.x, top: popover.y }}
        >
          <div className={s.popoverHeader}>
            <div className={s.popoverEventColor} data-color={popover.event.color} />
            <span className={s.popoverTitle}>{popover.event.title}</span>
            <button
              className={s.popoverClose}
              onClick={() => setPopover(p => ({ ...p, open: false }))}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className={s.popoverTime}>
            {formatDate(popover.event.start)} &middot; {formatTime(popover.event.start)} &ndash; {formatTime(popover.event.end)}
          </div>
          {popover.event.location && (
            <div className={s.popoverLocation}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
              </svg>
              {popover.event.location}
            </div>
          )}
          <div className={s.popoverActions}>
            <button className={s.popoverDeleteBtn} onClick={handleDelete}>
              Delete
            </button>
            <button
              className={s.popoverCancelBtn}
              onClick={() => setPopover(p => ({ ...p, open: false }))}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type PopoverDemo = 'creation' | 'detail';

export function PopoverSection() {
  const [demo, setDemo] = useState<PopoverDemo>('creation');

  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="popovers">
      <div className={s.sectionEyebrow}>Interaction</div>
      <h2 className={s.sectionTitle}>Popovers</h2>
      <p className={s.sectionDesc}>
        Use callbacks like <code className={s.inlineCode}>onSlotPress</code> and{' '}
        <code className={s.inlineCode}>onEventPress</code> to show popovers for creating
        or viewing events. Tempora stays headless &mdash; you bring your own popover UI.
      </p>

      <div className={s.variantPicker}>
        <button
          className={`${s.variantBtn} ${demo === 'creation' ? s.variantBtnActive : ''}`}
          onClick={() => setDemo('creation')}
        >
          <span className={s.variantDot} style={{ background: '#10b981' }} />
          Creation Popover
        </button>
        <button
          className={`${s.variantBtn} ${demo === 'detail' ? s.variantBtnActive : ''}`}
          onClick={() => setDemo('detail')}
        >
          <span className={s.variantDot} style={{ background: '#6366f1' }} />
          Detail Popover
        </button>
      </div>

      <div className={s.calendarContainer}>
        {demo === 'creation' ? <CreationDemo /> : <DetailDemo />}
      </div>

      <div className={s.note}>
        {demo === 'creation'
          ? 'Click an empty time slot to open the creation popover. Enter a title, pick a color, and save.'
          : 'Click any event to see its details. You can also delete events from the popover.'
        }
      </div>

      <CodeBlock>{demo === 'creation'
? `function MyCalendar() {
  const [popover, setPopover] = useState({ open: false, start: null, end: null });

  return (
    <div style={{ position: 'relative' }}>
      <Calendar
        events={events}
        onSlotPress={({ start, end, allDay }) => {
          setPopover({ open: true, start, end });
        }}
      />
      {popover.open && (
        <div className="creation-popover">
          <input placeholder="Event title" autoFocus />
          <button onClick={() => {
            addEvent({ title, start: popover.start, end: popover.end });
            setPopover({ open: false });
          }}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}`
: `function MyCalendar() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ position: 'relative' }}>
      <Calendar
        events={events}
        onEventPress={(event, e) => {
          setSelected({ event, x: e.clientX, y: e.clientY });
        }}
      />
      {selected && (
        <div className="detail-popover" style={{ left: selected.x, top: selected.y }}>
          <h3>{selected.event.title}</h3>
          <p>{formatTime(selected.event.start)} - {formatTime(selected.event.end)}</p>
          {selected.event.location && <p>{selected.event.location}</p>}
          <button onClick={() => deleteEvent(selected.event.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}`}</CodeBlock>
    </section>
  );
}
