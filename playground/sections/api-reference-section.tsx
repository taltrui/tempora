import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function ApiReferenceSection() {
  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="api">
      <div className={s.sectionEyebrow}>Reference</div>
      <h2 className={s.sectionTitle}>API Reference</h2>
      <p className={s.sectionDesc}>
        Complete reference for all Calendar props, event types, and callback payloads.
      </p>

      <h3 className={s.subTitle}>CalendarProps</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className={s.propsTable}>
          <thead>
            <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>events</td><td>{'CalendarEvent<TMeta>[]'}</td><td>required</td><td>Array of events to display</td></tr>
            <tr><td>date</td><td>Date</td><td>&mdash;</td><td>Controlled current date</td></tr>
            <tr><td>view</td><td>CalendarView</td><td>&mdash;</td><td>Controlled current view</td></tr>
            <tr><td>defaultDate</td><td>Date</td><td>new Date()</td><td>Initial date (uncontrolled)</td></tr>
            <tr><td>defaultView</td><td>CalendarView</td><td>'week'</td><td>Initial view (uncontrolled)</td></tr>
            <tr><td>viewConfig</td><td>ViewConfig</td><td>&mdash;</td><td>N-days and agenda configuration</td></tr>
            <tr><td>timeGrid</td><td>TimeGridConfig</td><td>defaults</td><td>Time grid configuration</td></tr>
            <tr><td>timezones</td><td>TimezoneConfig</td><td>&mdash;</td><td>Primary + optional secondary timezone</td></tr>
            <tr><td>weekStartsOn</td><td>0 | 1 | 2 | 3 | 4 | 5 | 6</td><td>0</td><td>First day of the week (0 = Sunday)</td></tr>
            <tr><td>locale</td><td>Locale</td><td>&mdash;</td><td>date-fns locale for formatting</td></tr>
            <tr><td>monthMaxEvents</td><td>number</td><td>3</td><td>Max visible events per day in month view</td></tr>
            <tr><td>draggable</td><td>boolean</td><td>true</td><td>Enable drag-to-move events</td></tr>
            <tr><td>resizable</td><td>boolean</td><td>true</td><td>Enable drag-to-resize events</td></tr>
            <tr><td>height</td><td>string | number</td><td>'100%'</td><td>Calendar container height</td></tr>
            <tr><td>slots</td><td>{'CalendarSlots<TMeta>'}</td><td>&mdash;</td><td>Custom slot components</td></tr>
            <tr><td>className</td><td>string</td><td>&mdash;</td><td>Additional CSS class</td></tr>
            <tr><td>style</td><td>CSSProperties</td><td>&mdash;</td><td>Inline styles</td></tr>
            <tr><td>onEventPress</td><td>(event, e) =&gt; void</td><td>&mdash;</td><td>Event click handler</td></tr>
            <tr><td>onEventDoubleClick</td><td>(event, e) =&gt; void</td><td>&mdash;</td><td>Event double-click handler</td></tr>
            <tr><td>onEventMove</td><td>(payload) =&gt; void</td><td>&mdash;</td><td>Event moved via drag</td></tr>
            <tr><td>onEventResize</td><td>(payload) =&gt; void</td><td>&mdash;</td><td>Event resized via drag</td></tr>
            <tr><td>onSlotPress</td><td>(payload) =&gt; void</td><td>&mdash;</td><td>Empty time slot clicked</td></tr>
            <tr><td>onDateClick</td><td>(date, view) =&gt; void</td><td>&mdash;</td><td>Date number clicked</td></tr>
            <tr><td>onShowMore</td><td>(date, events) =&gt; void</td><td>&mdash;</td><td>"+N more" button clicked</td></tr>
            <tr><td>onRangeChange</td><td>(payload) =&gt; void</td><td>&mdash;</td><td>Visible range changed</td></tr>
            <tr><td>onViewChange</td><td>(view) =&gt; void</td><td>&mdash;</td><td>View changed</td></tr>
            <tr><td>onDateChange</td><td>(date) =&gt; void</td><td>&mdash;</td><td>Date changed</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={s.subTitle}>CalendarEvent</h3>
      <CodeBlock>{`interface CalendarEvent<TMeta = Record<string, unknown>> {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor | string;
  draggable?: boolean;
  resizable?: boolean;
  calendarId?: string;
  description?: string;
  location?: string;
  meta?: TMeta;
}`}</CodeBlock>

      <h3 className={s.subTitle}>CalendarView</h3>
      <CodeBlock>{`type CalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda' | 'n-days';`}</CodeBlock>

      <h3 className={s.subTitle}>Callback payloads</h3>
      <CodeBlock>{`interface EventMovePayload<TMeta> {
  event: CalendarEvent<TMeta>;
  start: Date;
  end: Date;
  allDay: boolean;
}

interface EventResizePayload<TMeta> {
  event: CalendarEvent<TMeta>;
  start: Date;
  end: Date;
}

interface SlotPressPayload {
  start: Date;
  end: Date;
  allDay: boolean;
  view: CalendarView;
}

interface DateRangePayload {
  start: Date;
  end: Date;
  view: CalendarView;
}`}</CodeBlock>

      <h3 className={s.subTitle}>Configuration types</h3>
      <CodeBlock>{`interface TimeGridConfig {
  startHour: number;      // 0-23, default: 0
  endHour: number;        // 1-24, default: 24
  slotDuration: number;   // Minutes per slot, default: 30
  slotHeight: number;     // Pixels per slot, default: 48
  snapDuration: number;   // Snap granularity in minutes, default: 15
}

interface ViewConfig {
  nDays?: { count: number };
  agenda?: { length?: number };
}

interface TimezoneConfig {
  primary: string;
  secondary?: string;
}`}</CodeBlock>
    </section>
  );
}
