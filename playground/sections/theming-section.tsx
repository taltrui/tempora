import { useState } from 'react';
import { Calendar, EVENT_COLORS } from '../../src/index.ts';
import { SAMPLE_EVENTS } from '../sample-events.ts';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function ThemingSection() {
  const [dark, setDark] = useState(false);
  const [events] = useState(SAMPLE_EVENTS.slice(0, 10));

  return (
    <section className={s.section} id="theming">
      <div className={s.sectionEyebrow}>Styling</div>
      <h2 className={s.sectionTitle}>Theming</h2>
      <p className={s.sectionDesc}>
        Tempora uses CSS custom properties for theming. Override them on the calendar container or any ancestor.
      </p>

      <div className={s.themeToggle}>
        <button
          className={`${s.toggle} ${dark ? s.toggleActive : ''}`}
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
        />
        <span style={{ fontSize: 14, color: '#57534e' }}>
          {dark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      <div className={s.calendarContainer}>
        <Calendar
          events={events}
          defaultView="week"
          weekStartsOn={1}
          height={460}
          className={dark ? s.darkCalendar : undefined}
        />
      </div>

      <CodeBlock>{`.dark-calendar {
  --tempora-bg: #1c1917;
  --tempora-bg-secondary: #292524;
  --tempora-bg-today: #431407;
  --tempora-text-primary: #e7e5e4;
  --tempora-text-secondary: #a8a29e;
  --tempora-border: #44403c;
  --tempora-border-light: #292524;
  --tempora-primary: #ea580c;
}`}</CodeBlock>

      <h3 className={s.subTitle}>Event colors</h3>
      <p className={s.subDesc}>
        11 named colors inspired by Google Calendar. Use them by name or pass any custom hex value.
      </p>
      <div className={s.colorPalette}>
        {Object.entries(EVENT_COLORS).map(([name, hex]) => (
          <span key={name} className={s.colorSwatch}>
            <span className={s.swatchDot} style={{ backgroundColor: hex }} />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
