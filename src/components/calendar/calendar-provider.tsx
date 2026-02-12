import { useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from 'date-fns';
import { DndContext, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { isDragData } from '../../types/dnd.ts';
import type { CalendarEvent } from '../../types/event.ts';
import type { CalendarView, ViewConfig } from '../../types/view.ts';
import type { WeekStartsOn, TimeGridConfig, TimezoneConfig } from '../../types/datetime.ts';
import type { EventMovePayload, EventResizePayload, SlotPressPayload } from '../../types/callbacks.ts';
import type { CalendarSlots } from '../../types/slots.ts';
import type { UseCalendarReturn } from '../../hooks/use-calendar.ts';
import { useDragEvent } from '../../hooks/use-drag-event.ts';
import { useResizeEvent } from '../../hooks/use-resize-event.ts';
import { DragOverlayContent } from '../shared/drag-overlay-content/drag-overlay-content.tsx';
import { snapToColumnModifier, columnCollisionDetection } from '../../utils/snap-to-column-modifier.ts';
import {
  CalendarConfigContext,
  CalendarStateContext,
  type CalendarConfigValue,
  type CalendarStateValue,
} from '../../context/calendar-context.ts';

export interface CalendarProviderProps<TMeta = Record<string, unknown>> {
  calendarState: UseCalendarReturn<TMeta>;
  weekStartsOn: WeekStartsOn;
  timeGridConfig: TimeGridConfig;
  monthMaxEvents: number;
  timezones?: TimezoneConfig;
  viewConfig?: ViewConfig;
  locale?: Locale;
  slots?: CalendarSlots<TMeta>;
  onEventPress?: (event: CalendarEvent<TMeta>, e: React.MouseEvent) => void;
  onEventDoubleClick?: (event: CalendarEvent<TMeta>, e: React.MouseEvent) => void;
  onEventMove?: (payload: EventMovePayload<TMeta>) => void;
  onEventResize?: (payload: EventResizePayload<TMeta>) => void;
  onSlotPress?: (payload: SlotPressPayload) => void;
  onDateClick?: (date: Date, view: CalendarView) => void;
  onShowMore?: (date: Date, events: CalendarEvent<TMeta>[]) => void;
  draggableEnabled: boolean;
  resizableEnabled: boolean;
  children: ReactNode;
}

export function CalendarProvider<TMeta = Record<string, unknown>>({
  calendarState,
  weekStartsOn,
  timeGridConfig,
  monthMaxEvents,
  timezones,
  viewConfig,
  locale,
  slots,
  onEventPress,
  onEventDoubleClick,
  onEventMove,
  onEventResize,
  onSlotPress,
  onDateClick,
  onShowMore,
  draggableEnabled,
  resizableEnabled,
  children,
}: CalendarProviderProps<TMeta>) {
  if (process.env.NODE_ENV !== 'production') {
    if (draggableEnabled && !onEventMove) {
      console.warn(
        '[Tempora] `draggable` is enabled but no `onEventMove` callback was provided. ' +
        'Events will appear to move during drag but snap back on drop. ' +
        'Either provide `onEventMove` or set `draggable={false}`.',
      );
    }
    if (resizableEnabled && !onEventResize) {
      console.warn(
        '[Tempora] `resizable` is enabled but no `onEventResize` callback was provided. ' +
        'Events will appear to resize during drag but snap back on drop. ' +
        'Either provide `onEventResize` or set `resizable={false}`.',
      );
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { activeEvent, activeEventRect, handleDragStart, handleDragEnd: handleMoveDragEnd } = useDragEvent({
    onEventMove: onEventMove as ((payload: EventMovePayload) => void) | undefined,
    snapDuration: timeGridConfig.snapDuration,
    slotHeight: timeGridConfig.slotHeight,
    slotDuration: timeGridConfig.slotDuration,
    startHour: timeGridConfig.startHour,
  });

  const { handleResizeDragEnd } = useResizeEvent({
    onEventResize: onEventResize as ((payload: EventResizePayload) => void) | undefined,
    snapDuration: timeGridConfig.snapDuration,
    slotHeight: timeGridConfig.slotHeight,
    slotDuration: timeGridConfig.slotDuration,
    startHour: timeGridConfig.startHour,
    endHour: timeGridConfig.endHour,
  });

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const dragData = event.active.data.current;
    if (!isDragData(dragData)) {
      handleMoveDragEnd(event);
      return;
    }
    if (dragData.type === 'event-resize-top' || dragData.type === 'event-resize-bottom') {
      handleResizeDragEnd(event);
    } else {
      handleMoveDragEnd(event);
    }
  }, [handleMoveDragEnd, handleResizeDragEnd]);

  const onEventPressRef = useRef(onEventPress);
  onEventPressRef.current = onEventPress;
  const onEventDoubleClickRef = useRef(onEventDoubleClick);
  onEventDoubleClickRef.current = onEventDoubleClick;
  const onSlotPressRef = useRef(onSlotPress);
  onSlotPressRef.current = onSlotPress;
  const onDateClickRef = useRef(onDateClick);
  onDateClickRef.current = onDateClick;
  const onShowMoreRef = useRef(onShowMore);
  onShowMoreRef.current = onShowMore;
  const onEventMoveRef = useRef(onEventMove);
  onEventMoveRef.current = onEventMove;
  const onEventResizeRef = useRef(onEventResize);
  onEventResizeRef.current = onEventResize;

  const stableOnEventPress = useCallback(
    (...args: Parameters<NonNullable<typeof onEventPress>>) => onEventPressRef.current?.(...args),
    [],
  );
  const stableOnEventDoubleClick = useCallback(
    (...args: Parameters<NonNullable<typeof onEventDoubleClick>>) => onEventDoubleClickRef.current?.(...args),
    [],
  );
  const stableOnSlotPress = useCallback(
    (...args: Parameters<NonNullable<typeof onSlotPress>>) => onSlotPressRef.current?.(...args),
    [],
  );
  const stableOnDateClick = useCallback(
    (...args: Parameters<NonNullable<typeof onDateClick>>) => onDateClickRef.current?.(...args),
    [],
  );
  const stableOnShowMore = useCallback(
    (...args: Parameters<NonNullable<typeof onShowMore>>) => onShowMoreRef.current?.(...args),
    [],
  );
  const stableOnEventMove = useCallback(
    (...args: Parameters<NonNullable<typeof onEventMove>>) => onEventMoveRef.current?.(...args),
    [],
  );
  const stableOnEventResize = useCallback(
    (...args: Parameters<NonNullable<typeof onEventResize>>) => onEventResizeRef.current?.(...args),
    [],
  );

  const configValue = useMemo<CalendarConfigValue<TMeta>>(() => ({
    weekStartsOn,
    timeGridConfig,
    monthMaxEvents,
    timezones,
    viewConfig,
    locale,
    slots,
    draggableEnabled,
    resizableEnabled,
    onEventPress: stableOnEventPress,
    onEventDoubleClick: stableOnEventDoubleClick,
    onSlotPress: stableOnSlotPress,
    onDateClick: stableOnDateClick,
    onShowMore: stableOnShowMore,
    onEventMove: stableOnEventMove,
    onEventResize: stableOnEventResize,
  }), [
    weekStartsOn,
    timeGridConfig,
    monthMaxEvents,
    timezones,
    viewConfig,
    locale,
    slots,
    draggableEnabled,
    resizableEnabled,
    stableOnEventPress,
    stableOnEventDoubleClick,
    stableOnSlotPress,
    stableOnDateClick,
    stableOnShowMore,
    stableOnEventMove,
    stableOnEventResize,
  ]);

  const stateValue = useMemo<CalendarStateValue<TMeta>>(() => ({
    date: calendarState.date,
    view: calendarState.view,
    visibleRange: calendarState.visibleRange,
    visibleEvents: calendarState.visibleEvents,
    navigation: calendarState.navigation,
    setView: calendarState.setView,
    dateLabel: calendarState.dateLabel,
  }), [
    calendarState.date,
    calendarState.view,
    calendarState.visibleRange,
    calendarState.visibleEvents,
    calendarState.navigation,
    calendarState.setView,
    calendarState.dateLabel,
  ]);

  return (
    <CalendarConfigContext.Provider value={configValue as CalendarConfigValue}>
      <CalendarStateContext.Provider value={stateValue as CalendarStateValue}>
        <DndContext
          sensors={sensors}
          collisionDetection={columnCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {children}
          <DragOverlay dropAnimation={null} modifiers={[snapToColumnModifier]}>
            {activeEvent && activeEventRect && (
              <DragOverlayContent
                event={activeEvent}
                width={activeEventRect.width}
                height={activeEventRect.height}
              />
            )}
          </DragOverlay>
        </DndContext>
      </CalendarStateContext.Provider>
    </CalendarConfigContext.Provider>
  );
}
