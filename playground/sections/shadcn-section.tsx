import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Calendar,
  type CalendarEvent,
  type CalendarView,
  type ToolbarSlotProps,
  type EventContentSlotProps,
  type EventMovePayload,
  type EventResizePayload,
  type SlotPressPayload,
  type EventColor,
} from '../../src/index.ts';
import { SAMPLE_EVENTS, COLORS, nextId } from '../sample-events.ts';
import { Button } from '../components/ui/button.tsx';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

function ShadcnToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  const views: { value: CalendarView; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  return (
    <div className="flex items-center justify-between p-3 border-b border-border bg-background">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onPrev}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onNext}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        <h2 className="text-base font-semibold text-foreground ml-1">{dateLabel}</h2>
      </div>
      <div className="flex rounded-lg border border-border overflow-hidden">
        {views.map(v => (
          <button
            key={v.value}
            onClick={() => onViewChange(v.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-border last:border-r-0 ${
              view === v.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShadcnEventContent({ event }: EventContentSlotProps) {
  return (
    <div className="flex items-start gap-1.5 px-0.5">
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-[11px] leading-tight truncate">{event.title}</span>
        {event.location && (
          <span className="text-[10px] opacity-80 truncate">{event.location}</span>
        )}
      </div>
    </div>
  );
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

interface PopoverState {
  open: boolean;
  x: number;
  y: number;
  event: CalendarEvent | null;
}

interface CreationState {
  open: boolean;
  x: number;
  y: number;
  start: Date;
  end: Date;
  allDay: boolean;
}

function ShadcnDemo() {
  const [events, setEvents] = useState(SAMPLE_EVENTS.slice(0, 12));
  const [detail, setDetail] = useState<PopoverState>({ open: false, x: 0, y: 0, event: null });
  const [creation, setCreation] = useState<CreationState>({
    open: false, x: 0, y: 0, start: new Date(), end: new Date(), allDay: false,
  });
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<EventColor>('blueberry');
  const detailRef = useRef<HTMLDivElement>(null);
  const creationRef = useRef<HTMLDivElement>(null);

  useClickOutside(detailRef, () => setDetail(p => ({ ...p, open: false })));
  useClickOutside(creationRef, () => setCreation(p => ({ ...p, open: false })));

  const handleEventPress = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    setCreation(p => ({ ...p, open: false }));
    const calendarEl = document.querySelector('[id="shadcn-demo"]');
    const rect = calendarEl?.getBoundingClientRect();
    if (!rect) return;

    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    setDetail({
      open: true,
      x: Math.min(rect.width - 300, Math.max(0, relX - 150)),
      y: Math.min(rect.height - 200, Math.max(40, relY + 10)),
      event,
    });
  }, []);

  const handleSlotPress = useCallback((payload: SlotPressPayload) => {
    setDetail(p => ({ ...p, open: false }));
    const calendarEl = document.querySelector('[id="shadcn-demo"]');
    const rect = calendarEl?.getBoundingClientRect();
    if (!rect) return;

    setTitle('');
    setColor('blueberry');
    setCreation({
      open: true,
      x: Math.min(rect.width - 300, Math.max(0, (rect.width / 2) - 150)),
      y: Math.min(rect.height - 260, Math.max(40, (rect.height / 2) - 130)),
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
        start: creation.start,
        end: creation.end,
        allDay: creation.allDay,
        color,
      },
    ]);
    setCreation(p => ({ ...p, open: false }));
  };

  const handleDelete = () => {
    if (!detail.event) return;
    setEvents(prev => prev.filter(e => e.id !== detail.event!.id));
    setDetail(p => ({ ...p, open: false }));
  };

  const handleMove = useCallback((payload: EventMovePayload) => {
    setDetail(p => ({ ...p, open: false }));
    setCreation(p => ({ ...p, open: false }));
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleResize = useCallback((payload: EventResizePayload) => {
    setDetail(p => ({ ...p, open: false }));
    setCreation(p => ({ ...p, open: false }));
    setEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  return (
    <div id="shadcn-demo" style={{ position: 'relative' }}>
      <Calendar
        events={events}
        defaultView="week"
        weekStartsOn={1}
        height={500}
        onEventPress={handleEventPress}
        onSlotPress={handleSlotPress}
        onEventMove={handleMove}
        onEventResize={handleResize}
        slots={{
          toolbar: ShadcnToolbar,
          eventContent: ShadcnEventContent,
        }}
      />
      {detail.open && detail.event && (
        <div
          ref={detailRef}
          className="absolute z-50 w-72 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg p-4"
          style={{ left: detail.x, top: detail.y, animation: 'fadeUp 0.15s ease-out' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={s.popoverEventColor} data-color={detail.event.color} />
            <h4 className="flex-1 font-semibold text-sm">{detail.event.title}</h4>
            <button
              onClick={() => setDetail(p => ({ ...p, open: false }))}
              className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {formatDate(detail.event.start)} &middot; {formatTime(detail.event.start)} &ndash; {formatTime(detail.event.end)}
          </p>
          {detail.event.location && (
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
              </svg>
              {detail.event.location}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
            <Button size="sm" variant="outline" onClick={() => setDetail(p => ({ ...p, open: false }))}>Close</Button>
          </div>
        </div>
      )}
      {creation.open && (
        <div
          ref={creationRef}
          className="absolute z-50 w-72 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg p-4"
          style={{ left: creation.x, top: creation.y, animation: 'fadeUp 0.15s ease-out' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">New event</h4>
            <button
              onClick={() => setCreation(p => ({ ...p, open: false }))}
              className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {formatDate(creation.start)} &middot; {formatTime(creation.start)} &ndash; {formatTime(creation.end)}
          </p>
          <input
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring mb-3"
            placeholder="Event title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <div className="flex gap-1 mb-3 flex-wrap">
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
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setCreation(p => ({ ...p, open: false }))}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
              Create
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ShadcnSection() {
  return (
    <section className={s.section} id="shadcn">
      <div className={s.sectionEyebrow}>Integrations</div>
      <h2 className={s.sectionTitle}>shadcn/ui</h2>
      <p className={s.sectionDesc}>
        Tempora's slot system makes it easy to drop in shadcn/ui components for popovers,
        buttons, dialogs, and more.
      </p>

      <div className={s.integrationGrid}>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 10h16" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 6V4a2 2 0 014 0v2M10 6V4a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h4>Event Popover</h4>
          <p>Use shadcn Popover for event details on click</p>
        </div>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h4>Creation Dialog</h4>
          <p>Use shadcn Dialog for full event creation forms</p>
        </div>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 8l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h4>Custom Toolbar</h4>
          <p>Use shadcn Button, ToggleGroup, and Select</p>
        </div>
        <div className={s.integrationCard}>
          <div className={s.integrationCardIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h4>Date Picker</h4>
          <p>Use shadcn Calendar + Popover for date navigation</p>
        </div>
      </div>

      <h3 className={s.subTitle}>Live demo</h3>
      <p className={s.subDesc}>
        A fully interactive calendar using shadcn Button for the toolbar, with event detail
        and creation popovers styled using shadcn design tokens. Click events to view details,
        or click empty slots to create new ones.
      </p>

      <div className={s.calendarContainer}>
        <ShadcnDemo />
      </div>

      <div className={s.note}>
        This demo uses the shadcn Button component for the toolbar and popover actions.
        The popovers use Tailwind utility classes with shadcn's CSS variable system for colors.
      </div>

      <h3 className={s.subTitle}>Toolbar with shadcn components</h3>
      <p className={s.subDesc}>
        Build a polished toolbar using shadcn Button, ToggleGroup, and other primitives.
      </p>
      <CodeBlock>{`import { Calendar, type ToolbarSlotProps, type CalendarView } from 'tempora';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ShadcnToolbar({ dateLabel, onToday, onPrev, onNext, view, onViewChange }: ToolbarSlotProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>Today</Button>
        <Button variant="ghost" size="icon" onClick={onPrev}><ChevronLeft /></Button>
        <Button variant="ghost" size="icon" onClick={onNext}><ChevronRight /></Button>
        <h2 className="text-lg font-semibold ml-2">{dateLabel}</h2>
      </div>
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={v => v && onViewChange(v as CalendarView)}
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

<Calendar events={events} slots={{ toolbar: ShadcnToolbar }} />`}</CodeBlock>

      <h3 className={s.subTitle}>Event detail with Popover</h3>
      <p className={s.subDesc}>
        Wrap events using <code className={s.inlineCode}>eventWrapper</code> to attach a shadcn Popover
        that opens on click.
      </p>
      <CodeBlock>{`import { Calendar, type EventWrapperSlotProps } from 'tempora';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

function EventWithPopover({ event, children }: EventWrapperSlotProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-2">
          <h4 className="font-semibold">{event.title}</h4>
          <p className="text-sm text-muted-foreground">
            {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}
          </p>
          {event.location && (
            <p className="text-sm">{event.location}</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline">Edit</Button>
            <Button size="sm" variant="destructive">Delete</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

<Calendar
  events={events}
  slots={{ eventWrapper: EventWithPopover }}
/>`}</CodeBlock>

      <h3 className={s.subTitle}>Creation with Dialog</h3>
      <p className={s.subDesc}>
        Open a shadcn Dialog when a user clicks an empty slot to create a new event with a form.
      </p>
      <CodeBlock>{`import { Calendar, type SlotPressPayload } from 'tempora';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function MyCalendar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slot, setSlot] = useState<SlotPressPayload | null>(null);
  const [title, setTitle] = useState('');

  return (
    <>
      <Calendar
        events={events}
        onSlotPress={(payload) => {
          setSlot(payload);
          setTitle('');
          setDialogOpen(true);
        }}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <p className="text-sm text-muted-foreground">
              {slot?.start.toLocaleDateString()} {slot?.start.toLocaleTimeString()} -
              {slot?.end.toLocaleTimeString()}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              addEvent({ title, start: slot.start, end: slot.end });
              setDialogOpen(false);
            }}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}`}</CodeBlock>
    </section>
  );
}
