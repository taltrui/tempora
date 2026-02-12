import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TimeSlot } from '../../../types/datetime.ts';
import type { LayoutedEvent } from '../../../utils/layout.ts';
import type { DropSlotData } from '../../../types/dnd.ts';
import { useCalendarConfig, useCalendarState } from '../../../context/calendar-context.ts';
import { snapToSlot, dateFromMinutes } from '../../../utils/time.ts';
import { getDateKey } from '../../../utils/event.ts';
import { EventBlock } from '../event-block/event-block.tsx';
import { CurrentTimeIndicator } from './current-time-indicator.tsx';
import { clsx } from '../../../utils/clsx.ts';
import styles from './time-grid.module.scss';

interface TimeColumnProps {
  date: Date;
  events: LayoutedEvent[];
  slots: TimeSlot[];
  slotHeight: number;
  totalHeight: number;
  isToday: boolean;
  minutesToPixels: (minutes: number) => number;
}

export function TimeColumn(props: TimeColumnProps) {
  const { events, slots, slotHeight, totalHeight, isToday, minutesToPixels, date } = props;
  const { onSlotPress, timeGridConfig } = useCalendarConfig();
  const { view } = useCalendarState();

  const dropData = useMemo<DropSlotData>(() => ({ date, minutes: 0, allDay: false }), [date]);

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-column-${getDateKey(date)}`,
    data: dropData,
  });

  const handleColumnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const column = e.currentTarget;
    const rect = column.getBoundingClientRect();
    const clickY = e.clientY - rect.top + column.scrollTop;
    const pixelsPerMinute = slotHeight / timeGridConfig.slotDuration;
    const rawMinutes = clickY / pixelsPerMinute + timeGridConfig.startHour * 60;
    const snappedMinutes = snapToSlot(rawMinutes, timeGridConfig.snapDuration);
    const start = dateFromMinutes(date, snappedMinutes);
    const end = dateFromMinutes(date, snappedMinutes + 60);

    onSlotPress?.({ start, end, allDay: false, view });
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.column, isToday && styles.columnToday, isOver && styles.columnDragOver)}
      style={{ height: `${totalHeight}px` }}
      onClick={handleColumnClick}
    >
      {slots.map((slot) => (
        <div
          key={slot.start}
          className={styles.slot}
          style={{ height: `${slotHeight}px` }}
        />
      ))}
      {isToday && <CurrentTimeIndicator minutesToPixels={minutesToPixels} />}
      <SortableContext items={events.map(le => `event-move-${le.event.id}`)} strategy={verticalListSortingStrategy}>
        {events.map((layoutedEvent) => (
          <EventBlock
            key={layoutedEvent.event.id}
            layoutedEvent={layoutedEvent}
          />
        ))}
      </SortableContext>
    </div>
  );
}
