# Tempora

A feature-rich React calendar component with Google Calendar-like UX. Six views, drag-and-drop, customizable slots, CSS variable theming, and full TypeScript support with generic metadata.

## Features

- **6 views** &mdash; day, week, month, year, agenda, and configurable n-days
- **Drag & drop** &mdash; move and resize events with snap-to-grid (powered by @dnd-kit)
- **Click-to-create** &mdash; `onSlotPress` callback for creating events from empty time slots
- **11 built-in event colors** &mdash; tomato, flamingo, tangerine, banana, sage, basil, peacock, blueberry, lavender, grape, graphite
- **Generic `TMeta` type parameter** &mdash; attach arbitrary typed metadata to events
- **Controlled & uncontrolled modes** &mdash; manage date/view state externally or let Tempora handle it
- **7 customizable slots** &mdash; toolbar, eventContent, eventWrapper, dayHeader, timeGutterLabel, dayCell, showMoreButton
- **CSS variable theming** &mdash; 25+ CSS custom properties for full visual customization
- **Keyboard navigation** &mdash; arrow keys to navigate, T for today
- **Timezone support** &mdash; primary and optional secondary timezone gutters
- **Current time indicator** &mdash; live red line updated every 60 seconds

## Installation

```bash
pnpm add tempora @dnd-kit/core @dnd-kit/sortable date-fns
```

```bash
npm install tempora @dnd-kit/core @dnd-kit/sortable date-fns
```

```bash
yarn add tempora @dnd-kit/core @dnd-kit/sortable date-fns
```

### Peer Dependencies

| Package | Version |
|---|---|
| `react` | `>=18.0.0` |
| `react-dom` | `>=18.0.0` |
| `@dnd-kit/core` | `^6.3.1` |
| `@dnd-kit/sortable` | `^10.0.0` |
| `date-fns` | `^4.1.0` |

## Quick Start

```tsx
import { useState } from 'react';
import { Calendar, CalendarEvent } from 'tempora';
import 'tempora/style.css';

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team standup',
    start: new Date(2026, 0, 12, 9, 0),
    end: new Date(2026, 0, 12, 9, 30),
    color: 'peacock',
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    start: new Date(2026, 0, 12, 12, 0),
    end: new Date(2026, 0, 12, 13, 0),
    color: 'banana',
  },
  {
    id: '3',
    title: 'Company retreat',
    start: new Date(2026, 0, 14),
    end: new Date(2026, 0, 16),
    allDay: true,
    color: 'sage',
  },
];

function App() {
  const [myEvents, setMyEvents] = useState(events);

  return (
    <Calendar
      events={myEvents}
      defaultView="week"
      onEventMove={({ event, start, end }) => {
        setMyEvents((prev) =>
          prev.map((e) => (e.id === event.id ? { ...e, start, end } : e))
        );
      }}
      onEventResize={({ event, start, end }) => {
        setMyEvents((prev) =>
          prev.map((e) => (e.id === event.id ? { ...e, start, end } : e))
        );
      }}
    />
  );
}
```

## Examples

### Event Creation

Use `onSlotPress` to create events when users click empty time slots:

```tsx
<Calendar
  events={events}
  onSlotPress={({ start, end, allDay, view }) => {
    const newEvent = {
      id: crypto.randomUUID(),
      title: 'New event',
      start,
      end,
      allDay,
    };
    setEvents((prev) => [...prev, newEvent]);
  }}
/>
```

### Controlled Mode

Manage date and view state externally:

```tsx
const [date, setDate] = useState(new Date());
const [view, setView] = useState<CalendarView>('week');

<Calendar
  events={events}
  date={date}
  view={view}
  onDateChange={setDate}
  onViewChange={setView}
/>
```

### Custom Event Content

Replace the default event rendering with a custom component:

```tsx
<Calendar
  events={events}
  slots={{
    eventContent: ({ event, view }) => (
      <div>
        <strong>{event.title}</strong>
        {view !== 'month' && event.location && (
          <span>{event.location}</span>
        )}
      </div>
    ),
  }}
/>
```

### Custom Toolbar

Replace the built-in toolbar entirely:

```tsx
<Calendar
  events={events}
  slots={{
    toolbar: ({ date, view, dateLabel, onToday, onPrev, onNext, onViewChange }) => (
      <header>
        <button onClick={onPrev}>Back</button>
        <button onClick={onToday}>Today</button>
        <button onClick={onNext}>Forward</button>
        <h2>{dateLabel}</h2>
        <select value={view} onChange={(e) => onViewChange(e.target.value as CalendarView)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </header>
    ),
  }}
/>
```

### Typed Metadata

Use the `TMeta` generic to attach typed data to events:

```tsx
interface MyMeta {
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

const events: CalendarEvent<MyMeta>[] = [
  {
    id: '1',
    title: 'Fix login bug',
    start: new Date(2026, 0, 12, 10, 0),
    end: new Date(2026, 0, 12, 11, 0),
    meta: { priority: 'high', assignee: 'Alice' },
  },
];

<Calendar<MyMeta>
  events={events}
  onEventPress={(event) => {
    // event.meta is typed as MyMeta | undefined
    console.log(event.meta?.assignee);
  }}
  slots={{
    eventContent: ({ event }) => (
      <div>
        {event.title}
        {event.meta?.priority === 'high' && <span>!!!</span>}
      </div>
    ),
  }}
/>
```

### Theming

Override CSS variables on the calendar container or any ancestor:

```css
.dark-calendar {
  --tempora-bg: #1e1e1e;
  --tempora-bg-secondary: #2d2d2d;
  --tempora-bg-today: #1a3a5c;
  --tempora-text-primary: #e0e0e0;
  --tempora-text-secondary: #a0a0a0;
  --tempora-border: #404040;
  --tempora-border-light: #333333;
  --tempora-primary: #64b5f6;
}
```

```tsx
<div className="dark-calendar">
  <Calendar events={events} />
</div>
```

## API Reference

### CalendarProps

| Prop | Type | Default | Description |
|---|---|---|---|
| `events` | `CalendarEvent<TMeta>[]` | *required* | Array of events to display |
| `date` | `Date` | &mdash; | Controlled current date |
| `view` | `CalendarView` | &mdash; | Controlled current view |
| `defaultDate` | `Date` | `new Date()` | Initial date (uncontrolled) |
| `defaultView` | `CalendarView` | `'week'` | Initial view (uncontrolled) |
| `viewConfig` | `ViewConfig` | &mdash; | Configuration for n-days and agenda views |
| `timeGrid` | `TimeGridConfig` | See defaults below | Time grid configuration |
| `timezones` | `TimezoneConfig` | &mdash; | Primary and optional secondary timezone |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` (Sunday) | First day of the week |
| `locale` | `Locale` | &mdash; | date-fns locale for formatting |
| `monthMaxEvents` | `number` | `3` | Max visible events per day in month view |
| `draggable` | `boolean` | `true` | Enable drag-to-move events |
| `resizable` | `boolean` | `true` | Enable drag-to-resize events |
| `height` | `string \| number` | `'100%'` | Calendar container height |
| `slots` | `CalendarSlots<TMeta>` | &mdash; | Custom slot components |
| `className` | `string` | &mdash; | Additional CSS class |
| `style` | `React.CSSProperties` | &mdash; | Inline styles |
| `onEventPress` | `(event, e) => void` | &mdash; | Event click handler |
| `onEventDoubleClick` | `(event, e) => void` | &mdash; | Event double-click handler |
| `onEventMove` | `(payload: EventMovePayload) => void` | &mdash; | Event moved via drag |
| `onEventResize` | `(payload: EventResizePayload) => void` | &mdash; | Event resized via drag |
| `onSlotPress` | `(payload: SlotPressPayload) => void` | &mdash; | Empty time slot clicked |
| `onDateClick` | `(date, view) => void` | &mdash; | Date number clicked (month/year views) |
| `onShowMore` | `(date, events) => void` | &mdash; | "+N more" button clicked |
| `onRangeChange` | `(payload: DateRangePayload) => void` | &mdash; | Visible range changed |
| `onViewChange` | `(view) => void` | &mdash; | View changed |
| `onDateChange` | `(date) => void` | &mdash; | Date changed |

### CalendarEvent

```typescript
interface CalendarEvent<TMeta = Record<string, unknown>> {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor | string;   // Named color or custom hex. Default: 'peacock'
  draggable?: boolean;            // Per-event override
  resizable?: boolean;            // Per-event override
  calendarId?: string;
  description?: string;
  location?: string;
  meta?: TMeta;
}
```

### CalendarView

```typescript
type CalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda' | 'n-days';
```

### EventColor

```typescript
type EventColor =
  | 'tomato'     // #D50000
  | 'flamingo'   // #E67C73
  | 'tangerine'  // #F4511E
  | 'banana'     // #F6BF26
  | 'sage'       // #33B679
  | 'basil'      // #0B8043
  | 'peacock'    // #039BE5 (default)
  | 'blueberry'  // #3F51B5
  | 'lavender'   // #7986CB
  | 'grape'      // #8E24AA
  | 'graphite';  // #616161
```

### Callback Payloads

```typescript
interface EventMovePayload<TMeta> {
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
}
```

### Slots

All slots are optional. Pass them via the `slots` prop:

```tsx
<Calendar slots={{ toolbar: MyToolbar, eventContent: MyEventContent }} />
```

| Slot | Props | Description |
|---|---|---|
| `toolbar` | `ToolbarSlotProps` | Replaces the entire top toolbar |
| `eventContent` | `EventContentSlotProps<TMeta>` | Replaces the inner content of each event |
| `eventWrapper` | `EventWrapperSlotProps<TMeta>` | Wraps each event element (receives `children`) |
| `dayHeader` | `DayHeaderSlotProps` | Replaces column headers in day/week views |
| `timeGutterLabel` | `TimeGutterLabelSlotProps` | Replaces time labels in the left gutter |
| `dayCell` | `DayCellSlotProps` | Replaces day cells in month view |
| `showMoreButton` | `ShowMoreButtonSlotProps<TMeta>` | Replaces the "+N more" button in month view |

#### Slot Prop Interfaces

```typescript
interface ToolbarSlotProps {
  date: Date;
  view: CalendarView;
  dateLabel: string;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
}

interface EventContentSlotProps<TMeta> {
  event: CalendarEvent<TMeta>;
  view: CalendarView;
}

interface EventWrapperSlotProps<TMeta> {
  event: CalendarEvent<TMeta>;
  children: React.ReactNode;
}

interface DayHeaderSlotProps {
  date: Date;
  isToday: boolean;
  view: CalendarView;
}

interface TimeGutterLabelSlotProps {
  time: Date;
  timezone?: string;
}

interface DayCellSlotProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isOutsideMonth: boolean;
}

interface ShowMoreButtonSlotProps<TMeta> {
  date: Date;
  count: number;
  events: CalendarEvent<TMeta>[];
}
```

### Configuration Types

```typescript
interface TimeGridConfig {
  startHour: number;      // 0-23, default: 0
  endHour: number;        // 1-24, default: 24
  slotDuration: number;   // Minutes per slot, default: 30
  slotHeight: number;     // Pixels per slot, default: 48
  snapDuration: number;   // Snap granularity in minutes, default: 15
}

interface ViewConfig {
  nDays?: { count: number };       // Default count: 4
  agenda?: { length?: number };    // Default length: 30 days
}

interface TimezoneConfig {
  primary: string;         // IANA timezone, e.g. 'America/New_York'
  secondary?: string;      // Optional second gutter
}
```

### Hooks

#### useCalendar

The main orchestration hook. Powers the `<Calendar>` component internally; useful for building fully custom calendar UIs.

```typescript
function useCalendar<TMeta>(props: CalendarProps<TMeta>): {
  date: Date;
  view: CalendarView;
  visibleRange: TimeRange;
  visibleEvents: CalendarEvent<TMeta>[];
  navigation: NavigationActions;
  setView: (view: CalendarView) => void;
  dateLabel: string;
};
```

#### useControllable

Supports both controlled and uncontrolled component patterns:

```typescript
function useControllable<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (value: T) => void];
```

#### useNavigation

Returns navigation actions for the current date/view:

```typescript
function useNavigation(
  date: Date,
  view: CalendarView,
  setDate: (date: Date) => void,
  opts: { weekStartsOn: WeekStartsOn; nDays?: number; agendaLength?: number },
): {
  goToToday: () => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToDate: (date: Date) => void;
};
```

#### useViewState

Manages date + view state with controlled/uncontrolled support:

```typescript
function useViewState(props: {
  date?: Date;
  defaultDate?: Date;
  view?: CalendarView;
  defaultView?: CalendarView;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
}): {
  date: Date;
  view: CalendarView;
  setDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
};
```

#### useDateRange

Computes the visible date range for the current view:

```typescript
function useDateRange(
  date: Date,
  view: CalendarView,
  opts: { weekStartsOn: WeekStartsOn; nDays?: number; agendaLength?: number },
): TimeRange;
```

#### useTimeGrid

Generates time slots and pixel conversion utilities:

```typescript
function useTimeGrid(config: TimeGridConfig): {
  slots: TimeSlot[];
  totalHeight: number;
  minutesToPixels: (minutes: number) => number;
  pixelsToMinutes: (pixels: number) => number;
};
```

#### useEventLayout

Computes positioned layout for overlapping timed events:

```typescript
function useEventLayout<TMeta>(
  events: CalendarEvent<TMeta>[],
  date: Date,
  config: TimeGridConfig,
): LayoutedEvent<TMeta>[];
```

#### useDragEvent / useResizeEvent

Internal hooks for drag-to-move and drag-to-resize behavior. Exported for advanced custom view implementations.

#### useCalendarContext / useCalendarConfig / useCalendarState

Access calendar context from within custom slot components:

```typescript
function useCalendarConfig<TMeta>(): CalendarConfigValue<TMeta>;
function useCalendarState<TMeta>(): CalendarStateValue<TMeta>;
function useCalendarContext<TMeta>(): CalendarConfigValue<TMeta> & CalendarStateValue<TMeta>;
```

### Constants

| Constant | Value | Description |
|---|---|---|
| `DEFAULT_SLOT_DURATION` | `30` | Minutes per time slot |
| `DEFAULT_SLOT_HEIGHT` | `48` | Pixels per time slot |
| `DEFAULT_SNAP_DURATION` | `15` | Drag/resize snap granularity (minutes) |
| `DEFAULT_START_HOUR` | `0` | Grid start hour |
| `DEFAULT_END_HOUR` | `24` | Grid end hour |
| `DEFAULT_WEEK_STARTS_ON` | `0` | Sunday |
| `DEFAULT_VIEW` | `'week'` | Default calendar view |
| `DEFAULT_N_DAYS` | `4` | Default n-days count |
| `DEFAULT_MONTH_MAX_EVENTS` | `3` | Max events per day cell in month view |
| `DEFAULT_AGENDA_LENGTH` | `30` | Agenda view length in days |
| `EVENT_COLORS` | `Record<EventColor, string>` | Map of color names to hex values |
| `DEFAULT_TIME_GRID_CONFIG` | `TimeGridConfig` | Merged default grid config |

### Utilities

```typescript
function computeEventLayout<TMeta>(
  events: CalendarEvent<TMeta>[],
  date: Date,
  config: TimeGridConfig,
): LayoutedEvent<TMeta>[];

function groupEventsByDate<TMeta>(
  events: CalendarEvent<TMeta>[],
  dates: Date[],
): Map<string, CalendarEvent<TMeta>[]>;

function sortEvents<TMeta>(
  events: CalendarEvent<TMeta>[],
): CalendarEvent<TMeta>[];

function filterEventsForRange<TMeta>(
  events: CalendarEvent<TMeta>[],
  range: TimeRange,
): CalendarEvent<TMeta>[];

function getDateKey(date: Date): string;          // Returns 'YYYY-MM-DD'

function resolveEventColor(color?: EventColor | string): string;  // Resolves to hex

function getEventColors(color?: EventColor | string): { bg: string; text: string };

function clsx(...args: ClassValue[]): string;     // className utility
```

## Theming

Tempora uses CSS custom properties for theming. Override them on the calendar container or any ancestor element.

### CSS Variables

| Variable | Default | Description |
|---|---|---|
| `--tempora-bg` | `#fff` | Main background |
| `--tempora-bg-secondary` | `#f8f9fa` | Secondary background |
| `--tempora-bg-today` | `#e8f0fe` | Today highlight |
| `--tempora-bg-weekend` | `transparent` | Weekend columns |
| `--tempora-bg-outside` | `transparent` | Outside-month days |
| `--tempora-text-primary` | `#3c4043` | Primary text |
| `--tempora-text-secondary` | `#70757a` | Secondary text |
| `--tempora-text-disabled` | `#dadce0` | Disabled text |
| `--tempora-text-on-primary` | `#fff` | Text on primary elements |
| `--tempora-primary` | `#1a73e8` | Accent color |
| `--tempora-primary-hover` | `#1765cc` | Accent hover state |
| `--tempora-border` | `#dadce0` | Border color |
| `--tempora-border-light` | `#e8eaed` | Light borders (slot lines) |
| `--tempora-event-default-bg` | `#039be5` | Default event background |
| `--tempora-event-default-text` | `#fff` | Default event text |
| `--tempora-current-time` | `#ea4335` | Current time indicator |
| `--tempora-shadow-sm` | `0 1px 3px rgba(0,0,0,0.12)` | Small shadow |
| `--tempora-shadow-md` | `0 4px 12px rgba(0,0,0,0.15)` | Medium shadow |
| `--tempora-shadow-lg` | `0 8px 24px rgba(0,0,0,0.16)` | Large shadow |
| `--tempora-font-family` | system font stack | Font family |
| `--tempora-font-size` | `14px` | Base font size |
| `--tempora-toolbar-height` | `56px` | Toolbar height |
| `--tempora-gutter-width` | `60px` | Time gutter width |
| `--tempora-header-height` | `68px` | Day header height |

### Dark Mode Example

```css
@media (prefers-color-scheme: dark) {
  .calendar-wrapper {
    --tempora-bg: #1e1e1e;
    --tempora-bg-secondary: #2d2d2d;
    --tempora-bg-today: #1a3a5c;
    --tempora-bg-weekend: #252525;
    --tempora-text-primary: #e0e0e0;
    --tempora-text-secondary: #a0a0a0;
    --tempora-text-disabled: #555;
    --tempora-border: #404040;
    --tempora-border-light: #333;
    --tempora-primary: #64b5f6;
    --tempora-primary-hover: #90caf9;
    --tempora-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
    --tempora-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
}
```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `ArrowLeft` | Previous period |
| `ArrowRight` | Next period |
| `T` | Go to today |

## License

MIT
