import { useState, useCallback } from 'react';
import {
  Calendar,
  type CalendarEvent,
  type EventContentSlotProps,
  type DayHeaderSlotProps,
  type TimeGutterLabelSlotProps,
  type DayCellSlotProps,
  type EventMovePayload,
  type EventResizePayload,
} from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function dt(dayOffset: number, hour: number, minute = 0): Date {
  const monday = getMonday(new Date());
  const result = new Date(monday);
  result.setDate(result.getDate() + dayOffset);
  result.setHours(hour, minute, 0, 0);
  return result;
}

interface TaskMeta {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
}

const PRIORITY_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  urgent: { bg: '#fef2f2', border: '#fca5a5', label: 'Urgent' },
  high: { bg: '#fff7ed', border: '#fdba74', label: 'High' },
  medium: { bg: '#eff6ff', border: '#93c5fd', label: 'Med' },
  low: { bg: '#f0fdf4', border: '#86efac', label: 'Low' },
};

const STATUS_ICONS: Record<string, string> = {
  'todo': '\u25cb',
  'in-progress': '\u25d4',
  'done': '\u25cf',
};

const TASK_EVENTS: CalendarEvent<TaskMeta>[] = [
  { id: 'ts1', title: 'Fix auth regression', start: dt(0, 9, 0), end: dt(0, 11, 0), color: 'tomato', meta: { priority: 'urgent', status: 'in-progress', assignee: 'AK' } },
  { id: 'ts2', title: 'Design token audit', start: dt(0, 13, 0), end: dt(0, 15, 0), color: 'banana', meta: { priority: 'medium', status: 'todo', assignee: 'JL' } },
  { id: 'ts3', title: 'API pagination', start: dt(1, 10, 0), end: dt(1, 12, 30), color: 'blueberry', meta: { priority: 'high', status: 'in-progress', assignee: 'SM' } },
  { id: 'ts4', title: 'Write E2E tests', start: dt(1, 14, 0), end: dt(1, 16, 0), color: 'sage', meta: { priority: 'low', status: 'todo', assignee: 'RW' } },
  { id: 'ts5', title: 'Deploy staging', start: dt(2, 9, 0), end: dt(2, 10, 0), color: 'grape', meta: { priority: 'high', status: 'done', assignee: 'AK' } },
  { id: 'ts6', title: 'Sprint review deck', start: dt(2, 11, 0), end: dt(2, 12, 0), color: 'tangerine', meta: { priority: 'medium', status: 'todo', assignee: 'DP' } },
  { id: 'ts7', title: 'Refactor checkout', start: dt(3, 10, 0), end: dt(3, 13, 0), color: 'flamingo', meta: { priority: 'high', status: 'in-progress', assignee: 'SM' } },
  { id: 'ts8', title: 'Update docs', start: dt(3, 14, 0), end: dt(3, 15, 30), color: 'peacock', meta: { priority: 'low', status: 'todo', assignee: 'JL' } },
  { id: 'ts9', title: 'Perf profiling', start: dt(4, 9, 0), end: dt(4, 11, 0), color: 'graphite', meta: { priority: 'medium', status: 'todo', assignee: 'RW' } },
  { id: 'ts10', title: 'Security patch', start: dt(4, 13, 0), end: dt(4, 14, 30), color: 'tomato', meta: { priority: 'urgent', status: 'in-progress', assignee: 'AK' } },
];

function TaskEventContent({ event }: EventContentSlotProps<TaskMeta>) {
  const priority = event.meta?.priority ?? 'medium';
  const status = event.meta?.status ?? 'todo';
  const ps = PRIORITY_STYLES[priority];

  return (
    <div className={s.taskEvent}>
      <div className={s.taskEventHeader}>
        <span className={s.taskStatusIcon}>{STATUS_ICONS[status]}</span>
        <span className={s.taskEventTitle}>{event.title}</span>
      </div>
      <div className={s.taskEventFooter}>
        <span className={s.taskPriorityBadge} style={{ background: ps.bg, borderColor: ps.border }}>
          {ps.label}
        </span>
        {event.meta?.assignee && (
          <span className={s.taskAssignee}>{event.meta.assignee}</span>
        )}
      </div>
    </div>
  );
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EMOJIS = ['', '\u2615', '\ud83d\udcaa', '\ud83c\udfaf', '\ud83d\ude80', '\ud83c\udf89', '\u2728'];

function EmojiDayHeader({ date, isToday }: DayHeaderSlotProps) {
  const day = date.getDay();
  return (
    <div className={`${s.emojiDayHeader} ${isToday ? s.emojiDayHeaderToday : ''}`}>
      <span className={s.emojiDayEmoji}>{EMOJIS[day]}</span>
      <span className={s.emojiDayName}>{DAY_NAMES[day]}</span>
      <span className={s.emojiDayDate}>{date.getDate()}</span>
    </div>
  );
}

function RelativeTimeGutter({ time }: TimeGutterLabelSlotProps) {
  const hour = time.getHours();
  let label: string;
  if (hour < 6) label = 'Night';
  else if (hour < 9) label = 'Early';
  else if (hour < 12) label = 'Morning';
  else if (hour < 14) label = 'Midday';
  else if (hour < 17) label = 'Afternoon';
  else if (hour < 20) label = 'Evening';
  else label = 'Night';

  const dot = hour >= 9 && hour < 17;

  return (
    <div className={s.relativeGutter}>
      {dot && <span className={s.relativeGutterDot} />}
      <span className={s.relativeGutterTime}>
        {hour.toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
      </span>
      <span className={s.relativeGutterLabel}>{label}</span>
    </div>
  );
}

function RichDayCell({ date, events, isToday, isOutsideMonth }: DayCellSlotProps) {
  const hasEvents = events.length > 0;
  return (
    <div className={`${s.richDayCell} ${isToday ? s.richDayCellToday : ''} ${isOutsideMonth ? s.richDayCellOutside : ''}`}>
      <span className={s.richDayCellNumber}>{date.getDate()}</span>
      {hasEvents && (
        <div className={s.richDayCellDots}>
          {events.slice(0, 3).map((ev, i) => (
            <span key={i} className={s.richDayCellDot} style={{ background: ev.color && ev.color.startsWith('#') ? ev.color : undefined }} />
          ))}
        </div>
      )}
    </div>
  );
}

type SlotDemo = 'eventContent' | 'dayHeader' | 'timeGutter' | 'dayCell';

export function CustomSlotsSection() {
  const [activeSlot, setActiveSlot] = useState<SlotDemo>('eventContent');
  const [taskEvents, setTaskEvents] = useState(TASK_EVENTS);
  const [basicEvents] = useState(SAMPLE_EVENTS.slice(0, 12));

  const handleMove = useCallback((payload: EventMovePayload<TaskMeta>) => {
    setTaskEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleResize = useCallback((payload: EventResizePayload<TaskMeta>) => {
    setTaskEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  const slots: { id: SlotDemo; label: string; desc: string }[] = [
    { id: 'eventContent', label: 'Event Content', desc: 'Custom event rendering with priority badges and status icons' },
    { id: 'dayHeader', label: 'Day Header', desc: 'Emoji-enhanced column headers with custom styling' },
    { id: 'timeGutter', label: 'Time Gutter', desc: 'Human-readable time labels with work-hour indicators' },
    { id: 'dayCell', label: 'Day Cell', desc: 'Custom month view cells with event dot indicators' },
  ];

  return (
    <section className={s.section} id="custom-slots">
      <div className={s.sectionEyebrow}>Customization</div>
      <h2 className={s.sectionTitle}>Custom slots</h2>
      <p className={s.sectionDesc}>
        Replace parts of the calendar UI with your own components. Seven slots are available &mdash;
        pick any below to see it in action.
      </p>

      <div className={s.featureGrid}>
        <div className={s.featureCard}><h4>toolbar</h4><p>Replaces the entire top toolbar</p></div>
        <div className={s.featureCard}><h4>eventContent</h4><p>Replaces inner content of each event</p></div>
        <div className={s.featureCard}><h4>eventWrapper</h4><p>Wraps each event element</p></div>
        <div className={s.featureCard}><h4>dayHeader</h4><p>Replaces column headers in day/week</p></div>
        <div className={s.featureCard}><h4>timeGutterLabel</h4><p>Replaces time labels in left gutter</p></div>
        <div className={s.featureCard}><h4>dayCell</h4><p>Replaces day cells in month view</p></div>
        <div className={s.featureCard}><h4>showMoreButton</h4><p>Replaces the "+N more" button</p></div>
      </div>

      <h3 className={s.subTitle}>Live slot demos</h3>
      <p className={s.subDesc}>
        Select a slot to see a fully interactive example with custom components.
      </p>

      <div className={s.slotDemoTabs}>
        {slots.map(slot => (
          <button
            key={slot.id}
            className={`${s.slotDemoTab} ${activeSlot === slot.id ? s.slotDemoTabActive : ''}`}
            onClick={() => setActiveSlot(slot.id)}
          >
            <span className={s.slotDemoTabLabel}>{slot.label}</span>
            <span className={s.slotDemoTabDesc}>{slot.desc}</span>
          </button>
        ))}
      </div>

      <div className={s.calendarContainer}>
        {activeSlot === 'eventContent' && (
          <Calendar<TaskMeta>
            events={taskEvents}
            defaultView="week"
            weekStartsOn={1}
            height={480}
            onEventMove={handleMove}
            onEventResize={handleResize}
            timeGrid={{ startHour: 8, endHour: 18, slotDuration: 30, slotHeight: 48, snapDuration: 15 }}
            slots={{ eventContent: TaskEventContent }}
          />
        )}
        {activeSlot === 'dayHeader' && (
          <Calendar
            events={basicEvents}
            defaultView="week"
            weekStartsOn={1}
            height={480}
            slots={{ dayHeader: EmojiDayHeader }}
          />
        )}
        {activeSlot === 'timeGutter' && (
          <Calendar
            events={basicEvents}
            defaultView="week"
            weekStartsOn={1}
            height={480}
            slots={{ timeGutterLabel: RelativeTimeGutter }}
          />
        )}
        {activeSlot === 'dayCell' && (
          <Calendar
            events={basicEvents}
            defaultView="month"
            weekStartsOn={1}
            height={480}
            slots={{ dayCell: RichDayCell }}
          />
        )}
      </div>

      <CodeBlock>{`<Calendar
  events={events}
  slots={{
    // Replace event content with priority + status indicators
    eventContent: ({ event, view }) => (
      <div className="task-event">
        <span className="status-icon">{event.meta?.status}</span>
        <span>{event.title}</span>
        <span className="priority">{event.meta?.priority}</span>
      </div>
    ),

    // Custom day headers with emojis
    dayHeader: ({ date, isToday }) => (
      <div className={isToday ? 'today' : ''}>
        {date.toLocaleDateString('en', { weekday: 'short' })}
      </div>
    ),

    // Custom time gutter labels
    timeGutterLabel: ({ time }) => (
      <span>{time.getHours()}:{String(time.getMinutes()).padStart(2, '0')}</span>
    ),

    // Custom month day cells
    dayCell: ({ date, events, isToday }) => (
      <div className={isToday ? 'today-cell' : ''}>
        <span>{date.getDate()}</span>
        {events.length > 0 && <span className="dot" />}
      </div>
    ),
  }}
/>`}</CodeBlock>
    </section>
  );
}
