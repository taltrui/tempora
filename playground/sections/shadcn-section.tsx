import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

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
    </section>
  );
}
