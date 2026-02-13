import { useState, useCallback } from 'react';
import {
  Calendar,
  type CalendarView,
  type ToolbarSlotProps,
  type EventContentSlotProps,
  type EventMovePayload,
  type EventResizePayload,
} from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

function TailwindToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  const views: { value: CalendarView; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Today
        </button>
        <button onClick={onPrev} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={onNext} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 ml-1">
          {dateLabel}
        </h2>
      </div>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {views.map(v => (
          <button
            key={v.value}
            onClick={() => onViewChange(v.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-gray-200 last:border-r-0 ${
              view === v.value
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TailwindEventContent({ event }: EventContentSlotProps) {
  return (
    <div className="flex items-start gap-1.5 px-0.5">
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-[11px] leading-tight truncate">{event.title}</span>
        {event.location && (
          <span className="text-[10px] opacity-75 truncate mt-0.5">{event.location}</span>
        )}
      </div>
    </div>
  );
}

function TailwindDarkToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  const views: { value: CalendarView; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900">
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors"
        >
          Today
        </button>
        <button onClick={onPrev} className="p-1.5 hover:bg-gray-800 rounded-md transition-colors text-gray-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={onNext} className="p-1.5 hover:bg-gray-800 rounded-md transition-colors text-gray-400">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="text-base font-semibold text-gray-100 ml-1">
          {dateLabel}
        </h2>
      </div>
      <div className="flex rounded-lg border border-gray-600 overflow-hidden">
        {views.map(v => (
          <button
            key={v.value}
            onClick={() => onViewChange(v.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-gray-600 last:border-r-0 ${
              view === v.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type DemoVariant = 'light' | 'dark';

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function d(dayOffset: number, hour: number, minute = 0): Date {
  const monday = getMonday(new Date());
  const result = new Date(monday);
  result.setDate(result.getDate() + dayOffset);
  result.setHours(hour, minute, 0, 0);
  return result;
}

const DARK_MODE_EVENTS = [
  { id: 'tw-d1', title: 'Morning standup', start: d(0, 9, 0), end: d(0, 9, 30), color: 'tangerine' as const },
  { id: 'tw-d2', title: 'Deep work block', start: d(0, 10, 0), end: d(0, 12, 30), color: 'grape' as const },
  { id: 'tw-d3', title: 'Code review', start: d(1, 14, 0), end: d(1, 16, 0), color: 'blueberry' as const },
  { id: 'tw-d4', title: 'Design sync', start: d(1, 10, 0), end: d(1, 11, 30), color: 'flamingo' as const },
  { id: 'tw-d5', title: 'Sprint planning', start: d(2, 9, 0), end: d(2, 10, 30), color: 'peacock' as const },
  { id: 'tw-d6', title: 'Lunch break', start: d(2, 12, 0), end: d(2, 13, 0), color: 'sage' as const },
  { id: 'tw-d7', title: 'Client call', start: d(3, 11, 0), end: d(3, 12, 0), color: 'tomato' as const },
  { id: 'tw-d8', title: 'Workshop', start: d(3, 14, 0), end: d(3, 16, 0), color: 'lavender' as const },
  { id: 'tw-d9', title: 'Retro', start: d(4, 15, 0), end: d(4, 16, 0), color: 'banana' as const },
];

export function TailwindSection() {
  const [variant, setVariant] = useState<DemoVariant>('light');
  const [lightEvents, setLightEvents] = useState(SAMPLE_EVENTS.slice(0, 12));
  const [darkEvents, setDarkEvents] = useState(DARK_MODE_EVENTS);

  const handleLightMove = useCallback((payload: EventMovePayload) => {
    setLightEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleLightResize = useCallback((payload: EventResizePayload) => {
    setLightEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  const handleDarkMove = useCallback((payload: EventMovePayload) => {
    setDarkEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleDarkResize = useCallback((payload: EventResizePayload) => {
    setDarkEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="tailwind">
      <div className={s.sectionEyebrow}>Integrations</div>
      <h2 className={s.sectionTitle}>Tailwind CSS</h2>
      <p className={s.sectionDesc}>
        Tempora uses CSS custom properties for all styling. Override them with Tailwind's
        arbitrary property syntax or in your global CSS &mdash; no extra config needed.
      </p>

      <div className={s.integrationGrid}>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon} style={{ color: '#06b6d4' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 8c1.333-4 3.333-6 6-6 4 0 4.667 3 6.667 3.5C18.667 6 20 4.5 20 2M0 14c1.333-4 3.333-6 6-6 4 0 4.667 3 6.667 3.5C14.667 12 16 10.5 16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4>CSS Variables</h4>
          <p>Override Tempora's variables with Tailwind's arbitrary property syntax</p>
        </div>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon} style={{ color: '#8b5cf6' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="12" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h4>Utility Classes</h4>
          <p>Use Tailwind utilities inside custom slot components</p>
        </div>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon} style={{ color: '#f59e0b' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h4>Dark Mode</h4>
          <p>Integrate with Tailwind's dark mode class strategy</p>
        </div>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon} style={{ color: '#ec4899' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3l2.5 5 5.5.8-4 3.9.9 5.3L10 15.5 5.1 18l.9-5.3-4-3.9 5.5-.8L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4>Design Tokens</h4>
          <p>Map Tailwind theme tokens to Tempora variables</p>
        </div>
      </div>

      <h3 className={s.subTitle}>Live demo</h3>
      <p className={s.subDesc}>
        Toolbar and event content built entirely with Tailwind utility classes. Toggle between
        light and dark to see how CSS variable overrides theme the calendar.
      </p>

      <div className={s.variantPicker}>
        <button
          className={`${s.variantBtn} ${variant === 'light' ? s.variantBtnActive : ''}`}
          onClick={() => setVariant('light')}
        >
          <span className={s.variantDot} style={{ background: '#f59e0b' }} />
          Light
        </button>
        <button
          className={`${s.variantBtn} ${variant === 'dark' ? s.variantBtnActive : ''}`}
          onClick={() => setVariant('dark')}
        >
          <span className={s.variantDot} style={{ background: '#6366f1' }} />
          Dark
        </button>
      </div>

      <div className={s.calendarContainer} style={variant === 'dark' ? { background: '#111827', borderColor: '#374151' } : undefined}>
        {variant === 'light' ? (
          <Calendar
            events={lightEvents}
            defaultView="week"
            weekStartsOn={1}
            height={500}
            onEventMove={handleLightMove}
            onEventResize={handleLightResize}
            slots={{
              toolbar: TailwindToolbar,
              eventContent: TailwindEventContent,
            }}
          />
        ) : (
          <Calendar
            events={darkEvents}
            defaultView="week"
            weekStartsOn={1}
            height={500}
            onEventMove={handleDarkMove}
            onEventResize={handleDarkResize}
            className={s.tailwindDark}
            slots={{
              toolbar: TailwindDarkToolbar,
              eventContent: TailwindEventContent,
            }}
          />
        )}
      </div>

      <div className={s.note}>
        {variant === 'light'
          ? 'The toolbar and event content are styled purely with Tailwind utility classes. Drag events to rearrange.'
          : 'Dark mode is achieved by overriding Tempora\'s CSS variables. The toolbar uses dark Tailwind utilities.'}
      </div>

      <h3 className={s.subTitle}>Variable overrides</h3>
      <p className={s.subDesc}>
        Override Tempora's CSS variables using Tailwind's arbitrary property syntax directly
        on the calendar container.
      </p>
      <CodeBlock>{`<Calendar
  events={events}
  className="
    [--tempora-bg:theme(colors.white)]
    [--tempora-bg-secondary:theme(colors.gray.50)]
    [--tempora-text-primary:theme(colors.gray.900)]
    [--tempora-text-secondary:theme(colors.gray.500)]
    [--tempora-border:theme(colors.gray.200)]
    [--tempora-border-light:theme(colors.gray.100)]
    [--tempora-primary:theme(colors.blue.600)]
    [--tempora-primary-hover:theme(colors.blue.700)]
    [--tempora-bg-today:theme(colors.blue.50)]
    [--tempora-current-time:theme(colors.red.500)]
  "
/>`}</CodeBlock>

      <h3 className={s.subTitle}>Dark mode</h3>
      <p className={s.subDesc}>
        Use Tailwind's <code className={s.inlineCode}>dark:</code> variant to apply dark theme
        variables automatically.
      </p>
      <CodeBlock>{`/* globals.css */
.tempora-calendar {
  --tempora-bg: theme(colors.white);
  --tempora-text-primary: theme(colors.gray.900);
  --tempora-border: theme(colors.gray.200);
  --tempora-primary: theme(colors.blue.600);
}

.dark .tempora-calendar {
  --tempora-bg: theme(colors.gray.950);
  --tempora-bg-secondary: theme(colors.gray.900);
  --tempora-bg-today: theme(colors.blue.950);
  --tempora-text-primary: theme(colors.gray.100);
  --tempora-text-secondary: theme(colors.gray.400);
  --tempora-border: theme(colors.gray.800);
  --tempora-border-light: theme(colors.gray.900);
  --tempora-primary: theme(colors.blue.500);
  --tempora-current-time: theme(colors.red.400);
}

/* Then in your component: */
<Calendar events={events} className="tempora-calendar" />`}</CodeBlock>

      <h3 className={s.subTitle}>Slot components with Tailwind</h3>
      <p className={s.subDesc}>
        Use Tailwind utility classes freely inside custom slot components.
      </p>
      <CodeBlock>{`<Calendar
  events={events}
  slots={{
    toolbar: ({ dateLabel, onToday, onPrev, onNext, view, onViewChange }) => (
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-sm font-medium rounded-md border
                       border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button onClick={onPrev} className="p-1 hover:bg-gray-100 rounded">←</button>
          <button onClick={onNext} className="p-1 hover:bg-gray-100 rounded">→</button>
          <h2 className="text-lg font-semibold text-gray-900 ml-2">{dateLabel}</h2>
        </div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(['day', 'week', 'month'] as const).map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={\`px-3 py-1.5 text-sm font-medium transition-colors
                \${view === v
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
                }\`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    ),

    eventContent: ({ event }) => (
      <div className="flex items-start gap-1.5 p-0.5">
        <div className="font-semibold text-[11px] leading-tight truncate">
          {event.title}
        </div>
        {event.location && (
          <div className="text-[10px] opacity-75 truncate mt-0.5">
            {event.location}
          </div>
        )}
      </div>
    ),
  }}
/>`}</CodeBlock>

      <h3 className={s.subTitle}>Design token mapping</h3>
      <p className={s.subDesc}>
        Map your Tailwind theme to Tempora for consistent styling across your app.
      </p>
      <CodeBlock>{`/* tailwind.config.ts */
export default {
  theme: {
    extend: {
      colors: {
        calendar: {
          bg: 'var(--tempora-bg)',
          text: 'var(--tempora-text-primary)',
          border: 'var(--tempora-border)',
          primary: 'var(--tempora-primary)',
          today: 'var(--tempora-bg-today)',
        },
      },
    },
  },
};

/* Now use in your components: */
<div className="bg-calendar-bg text-calendar-text border-calendar-border">
  Calendar wrapper styled with Tailwind tokens
</div>`}</CodeBlock>
    </section>
  );
}
