import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function TailwindSection() {
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
          <button onClick={onPrev} className="p-1 hover:bg-gray-100 rounded">
            &larr;
          </button>
          <button onClick={onNext} className="p-1 hover:bg-gray-100 rounded">
            &rarr;
          </button>
          <h2 className="text-lg font-semibold text-gray-900 ml-2">
            {dateLabel}
          </h2>
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
