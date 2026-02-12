import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import type { CalendarEvent } from '../types/event.ts';
import type { DragData, DropSlotData } from '../types/dnd.ts';
import { useDragEvent } from './use-drag-event.ts';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: '1',
    title: 'Meeting',
    start: new Date(2025, 5, 15, 10, 0),
    end: new Date(2025, 5, 15, 11, 0),
    ...overrides,
  };
}

function makeDragData(event: CalendarEvent): DragData {
  return {
    type: 'event-move',
    eventId: event.id,
    event,
    originalStart: event.start,
    originalEnd: event.end,
  };
}

function makeDragStartEvent(event: CalendarEvent): DragStartEvent {
  return {
    active: {
      id: `event-move-${event.id}`,
      data: { current: makeDragData(event) },
      rect: { current: { initial: null, translated: null } },
    },
    activatorEvent: new MouseEvent('pointerdown'),
  } as unknown as DragStartEvent;
}

function makeDragEndEvent(
  event: CalendarEvent,
  deltaY: number,
  overData?: DropSlotData,
): DragEndEvent {
  return {
    active: {
      id: `event-move-${event.id}`,
      data: { current: makeDragData(event) },
      rect: { current: { initial: null, translated: null } },
    },
    activatorEvent: new MouseEvent('pointerdown'),
    delta: { x: 0, y: deltaY },
    collisions: null,
    over: overData
      ? {
          id: 'drop-column-2025-06-15',
          rect: { width: 100, height: 1000, top: 0, left: 0, right: 100, bottom: 1000 },
          disabled: false,
          data: { current: overData },
        }
      : null,
  } as unknown as DragEndEvent;
}

describe('useDragEvent', () => {
  const defaultOptions = {
    snapDuration: 15,
    slotHeight: 48,
    slotDuration: 30,
    startHour: 0,
  };

  it('initially has no active event', () => {
    const { result } = renderHook(() => useDragEvent(defaultOptions));

    expect(result.current.activeEvent).toBeNull();
  });

  it('handleDragStart sets activeEvent from drag data', () => {
    const event = makeEvent();
    const { result } = renderHook(() => useDragEvent(defaultOptions));

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    expect(result.current.activeEvent).toEqual(event);
  });

  it('handleDragEnd with valid drop computes correct new start/end (moved down 2 hours)', () => {
    const onEventMove = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 120 * pixelsPerMinute;

    const overData: DropSlotData = {
      date: new Date(2025, 5, 15),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, deltaY, overData));
    });

    expect(onEventMove).toHaveBeenCalledTimes(1);
    const payload = onEventMove.mock.calls[0][0];
    expect(payload.event).toEqual(event);
    expect(payload.start).toEqual(new Date(2025, 5, 15, 12, 0));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 13, 0));
    expect(payload.allDay).toBe(false);
  });

  it('preserves event duration when moving', () => {
    const onEventMove = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 9, 0),
      end: new Date(2025, 5, 15, 10, 30),
    });
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 60 * pixelsPerMinute;

    const overData: DropSlotData = {
      date: new Date(2025, 5, 15),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, deltaY, overData));
    });

    const payload = onEventMove.mock.calls[0][0];
    const duration = payload.end.getTime() - payload.start.getTime();
    expect(duration).toBe(90 * 60 * 1000);
    expect(payload.start).toEqual(new Date(2025, 5, 15, 10, 0));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 11, 30));
  });

  it('handleDragEnd fires onEventMove with correct payload', () => {
    const onEventMove = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const overData: DropSlotData = {
      date: new Date(2025, 5, 16),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, 0, overData));
    });

    expect(onEventMove).toHaveBeenCalledWith({
      event,
      start: new Date(2025, 5, 16, 10, 0),
      end: new Date(2025, 5, 16, 11, 0),
      allDay: false,
    });
  });

  it('handleDragEnd with no over clears activeEvent without firing callback', () => {
    const onEventMove = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    expect(result.current.activeEvent).toEqual(event);

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, 100));
    });

    expect(result.current.activeEvent).toBeNull();
    expect(onEventMove).not.toHaveBeenCalled();
  });

  it('handleDragEnd clears activeEvent after processing', () => {
    const onEventMove = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const overData: DropSlotData = {
      date: new Date(2025, 5, 15),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, 0, overData));
    });

    expect(result.current.activeEvent).toBeNull();
  });

  it('snaps new start time to snapDuration intervals', () => {
    const onEventMove = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 10, 0),
      end: new Date(2025, 5, 15, 11, 0),
    });
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 7 * pixelsPerMinute;

    const overData: DropSlotData = {
      date: new Date(2025, 5, 15),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, deltaY, overData));
    });

    const payload = onEventMove.mock.calls[0][0];
    const newStartMinutes = payload.start.getHours() * 60 + payload.start.getMinutes();
    expect(newStartMinutes % 15).toBe(0);
  });

  it('moves event to a different day via drop target date', () => {
    const onEventMove = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 14, 0),
      end: new Date(2025, 5, 15, 15, 0),
    });
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const overData: DropSlotData = {
      date: new Date(2025, 5, 17),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, 0, overData));
    });

    const payload = onEventMove.mock.calls[0][0];
    expect(payload.start.getDate()).toBe(17);
    expect(payload.end.getDate()).toBe(17);
    expect(payload.start.getHours()).toBe(14);
    expect(payload.end.getHours()).toBe(15);
  });

  it('does not fire onEventMove if onEventMove is not provided', () => {
    const event = makeEvent();
    const { result } = renderHook(() => useDragEvent(defaultOptions));

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const overData: DropSlotData = {
      date: new Date(2025, 5, 15),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, 0, overData));
    });

    expect(result.current.activeEvent).toBeNull();
  });

  it('handles drop over a sortable event (DragData) by using event start date', () => {
    const onEventMove = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 10, 0),
      end: new Date(2025, 5, 15, 11, 0),
    });
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const targetEvent = makeEvent({
      id: '2',
      title: 'Target',
      start: new Date(2025, 5, 17, 14, 0),
      end: new Date(2025, 5, 17, 15, 0),
    });

    const overDragData: DragData = {
      type: 'event-move',
      eventId: targetEvent.id,
      event: targetEvent,
      originalStart: targetEvent.start,
      originalEnd: targetEvent.end,
    };

    const dragEndEvent = {
      active: {
        id: `event-move-${event.id}`,
        data: { current: makeDragData(event) },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new MouseEvent('pointerdown'),
      delta: { x: 0, y: 0 },
      collisions: null,
      over: {
        id: `event-move-${targetEvent.id}`,
        rect: { width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50 },
        disabled: false,
        data: { current: overDragData },
      },
    } as unknown as DragEndEvent;

    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });

    expect(onEventMove).toHaveBeenCalledTimes(1);
    const payload = onEventMove.mock.calls[0][0];
    expect(payload.start.getDate()).toBe(17);
    expect(payload.start.getHours()).toBe(10);
    expect(payload.allDay).toBe(false);
  });

  it('clamps new start to not go below startHour', () => {
    const onEventMove = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 0, 15),
      end: new Date(2025, 5, 15, 1, 15),
    });
    const { result } = renderHook(() =>
      useDragEvent({ ...defaultOptions, onEventMove }),
    );

    act(() => {
      result.current.handleDragStart(makeDragStartEvent(event));
    });

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = -30 * pixelsPerMinute;

    const overData: DropSlotData = {
      date: new Date(2025, 5, 15),
      minutes: 0,
      allDay: false,
    };

    act(() => {
      result.current.handleDragEnd(makeDragEndEvent(event, deltaY, overData));
    });

    const payload = onEventMove.mock.calls[0][0];
    expect(payload.start.getHours()).toBe(0);
    expect(payload.start.getMinutes()).toBe(0);
  });
});
