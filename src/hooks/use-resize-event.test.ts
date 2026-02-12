import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { CalendarEvent } from '../types/event.ts';
import type { DragData } from '../types/dnd.ts';
import { useResizeEvent } from './use-resize-event.ts';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: '1',
    title: 'Meeting',
    start: new Date(2025, 5, 15, 9, 0),
    end: new Date(2025, 5, 15, 10, 0),
    ...overrides,
  };
}

function makeResizeDragData(
  event: CalendarEvent,
  position: 'top' | 'bottom',
): DragData {
  return {
    type: position === 'top' ? 'event-resize-top' : 'event-resize-bottom',
    eventId: event.id,
    event,
    originalStart: event.start,
    originalEnd: event.end,
  };
}

function makeResizeDragEndEvent(
  event: CalendarEvent,
  position: 'top' | 'bottom',
  deltaY: number,
): DragEndEvent {
  return {
    active: {
      id: `event-resize-${position}-${event.id}`,
      data: { current: makeResizeDragData(event, position) },
      rect: { current: { initial: null, translated: null } },
    },
    activatorEvent: new MouseEvent('pointerdown'),
    delta: { x: 0, y: deltaY },
    collisions: null,
    over: null,
  } as unknown as DragEndEvent;
}

describe('useResizeEvent', () => {
  const defaultOptions = {
    snapDuration: 15,
    slotHeight: 48,
    slotDuration: 30,
    startHour: 0,
    endHour: 24,
  };

  it('resize-bottom: dragging down extends event end time', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 60 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'bottom', deltaY),
      );
    });

    expect(onEventResize).toHaveBeenCalledTimes(1);
    const payload = onEventResize.mock.calls[0][0];
    expect(payload.event).toEqual(event);
    expect(payload.start).toEqual(new Date(2025, 5, 15, 9, 0));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 11, 0));
  });

  it('resize-bottom: dragging up shrinks event end time', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = -30 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'bottom', deltaY),
      );
    });

    expect(onEventResize).toHaveBeenCalledTimes(1);
    const payload = onEventResize.mock.calls[0][0];
    expect(payload.start).toEqual(new Date(2025, 5, 15, 9, 0));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 9, 30));
  });

  it('resize-top: dragging up changes event start time earlier', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = -60 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'top', deltaY),
      );
    });

    expect(onEventResize).toHaveBeenCalledTimes(1);
    const payload = onEventResize.mock.calls[0][0];
    expect(payload.start).toEqual(new Date(2025, 5, 15, 8, 0));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 10, 0));
  });

  it('resize-top: dragging down changes event start time later', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 30 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'top', deltaY),
      );
    });

    expect(onEventResize).toHaveBeenCalledTimes(1);
    const payload = onEventResize.mock.calls[0][0];
    expect(payload.start).toEqual(new Date(2025, 5, 15, 9, 30));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 10, 0));
  });

  it('resize snaps to snapDuration intervals', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 25 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'bottom', deltaY),
      );
    });

    const payload = onEventResize.mock.calls[0][0];
    expect(payload.end).toEqual(new Date(2025, 5, 15, 10, 30));
  });

  it('resize-bottom: enforces minimum duration of snapDuration', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = -120 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'bottom', deltaY),
      );
    });

    const payload = onEventResize.mock.calls[0][0];
    expect(payload.start).toEqual(new Date(2025, 5, 15, 9, 0));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 9, 15));
  });

  it('resize-top: enforces minimum duration of snapDuration', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 120 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'top', deltaY),
      );
    });

    const payload = onEventResize.mock.calls[0][0];
    expect(payload.start).toEqual(new Date(2025, 5, 15, 9, 45));
    expect(payload.end).toEqual(new Date(2025, 5, 15, 10, 0));
  });

  it('onEventResize fires with correct payload', () => {
    const onEventResize = vi.fn();
    const event = makeEvent({
      id: 'evt-42',
      title: 'Standup',
      start: new Date(2025, 5, 15, 14, 0),
      end: new Date(2025, 5, 15, 14, 30),
    });
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 30 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'bottom', deltaY),
      );
    });

    expect(onEventResize).toHaveBeenCalledWith({
      event,
      start: new Date(2025, 5, 15, 14, 0),
      end: new Date(2025, 5, 15, 15, 0),
    });
  });

  it('does nothing if onEventResize is not provided', () => {
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent(defaultOptions),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 60 * pixelsPerMinute;

    expect(() => {
      act(() => {
        result.current.handleResizeDragEnd(
          makeResizeDragEndEvent(event, 'bottom', deltaY),
        );
      });
    }).not.toThrow();
  });

  it('does nothing for non-resize drag types', () => {
    const onEventResize = vi.fn();
    const event = makeEvent();
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const moveDragData: DragData = {
      type: 'event-move',
      eventId: event.id,
      event,
      originalStart: event.start,
      originalEnd: event.end,
    };

    const dragEndEvent = {
      active: {
        id: `event-move-${event.id}`,
        data: { current: moveDragData },
        rect: { current: { initial: null, translated: null } },
      },
      activatorEvent: new MouseEvent('pointerdown'),
      delta: { x: 0, y: 100 },
      collisions: null,
      over: null,
    } as unknown as DragEndEvent;

    act(() => {
      result.current.handleResizeDragEnd(dragEndEvent);
    });

    expect(onEventResize).not.toHaveBeenCalled();
  });

  it('resize-top: clamps start to not go below startHour', () => {
    const onEventResize = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 0, 15),
      end: new Date(2025, 5, 15, 1, 0),
    });
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = -60 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'top', deltaY),
      );
    });

    const payload = onEventResize.mock.calls[0][0];
    expect(payload.start).toEqual(new Date(2025, 5, 15, 0, 0));
  });

  it('resize-bottom: clamps end to not exceed endHour', () => {
    const onEventResize = vi.fn();
    const event = makeEvent({
      start: new Date(2025, 5, 15, 23, 0),
      end: new Date(2025, 5, 15, 23, 30),
    });
    const { result } = renderHook(() =>
      useResizeEvent({ ...defaultOptions, onEventResize }),
    );

    const pixelsPerMinute = defaultOptions.slotHeight / defaultOptions.slotDuration;
    const deltaY = 120 * pixelsPerMinute;

    act(() => {
      result.current.handleResizeDragEnd(
        makeResizeDragEndEvent(event, 'bottom', deltaY),
      );
    });

    const payload = onEventResize.mock.calls[0][0];
    expect(payload.end).toEqual(new Date(2025, 5, 16, 0, 0));
  });
});
