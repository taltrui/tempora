import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalendar } from './use-calendar.ts';
import type { CalendarEvent } from '../types/event.ts';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: '1',
    title: 'Test Event',
    start: new Date(2026, 1, 11, 10, 0),
    end: new Date(2026, 1, 11, 11, 0),
    ...overrides,
  };
}

describe('useCalendar', () => {
  it('returns correct date, view, and dateLabel for defaults', () => {
    const { result } = renderHook(() =>
      useCalendar({
        events: [],
        defaultDate: new Date(2026, 1, 11),
      }),
    );

    expect(result.current.date).toEqual(new Date(2026, 1, 11));
    expect(result.current.view).toBe('week');
    expect(result.current.dateLabel).toBe('Feb 8 \u2013 14, 2026');
  });

  it('filters only events within the visible range', () => {
    const insideEvent = makeEvent({
      id: '1',
      start: new Date(2026, 1, 11, 10, 0),
      end: new Date(2026, 1, 11, 11, 0),
    });
    const outsideEvent = makeEvent({
      id: '2',
      start: new Date(2026, 2, 1, 10, 0),
      end: new Date(2026, 2, 1, 11, 0),
    });

    const { result } = renderHook(() =>
      useCalendar({
        events: [insideEvent, outsideEvent],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'week',
      }),
    );

    expect(result.current.visibleEvents).toHaveLength(1);
    expect(result.current.visibleEvents[0].id).toBe('1');
  });

  it('includes events that partially overlap the range', () => {
    const partialOverlap = makeEvent({
      id: '1',
      start: new Date(2026, 1, 7, 22, 0),
      end: new Date(2026, 1, 8, 2, 0),
    });

    const { result } = renderHook(() =>
      useCalendar({
        events: [partialOverlap],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'week',
        weekStartsOn: 0,
      }),
    );

    expect(result.current.visibleEvents).toHaveLength(1);
    expect(result.current.visibleEvents[0].id).toBe('1');
  });

  it('excludes events completely outside the range', () => {
    const outsideEvent = makeEvent({
      id: '1',
      start: new Date(2026, 1, 15, 10, 0),
      end: new Date(2026, 1, 15, 11, 0),
    });

    const { result } = renderHook(() =>
      useCalendar({
        events: [outsideEvent],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'week',
        weekStartsOn: 0,
      }),
    );

    expect(result.current.visibleEvents).toHaveLength(0);
  });

  it('navigation.goToNext changes the date', () => {
    const { result } = renderHook(() =>
      useCalendar({
        events: [],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'day',
      }),
    );

    act(() => {
      result.current.navigation.goToNext();
    });

    expect(result.current.date).toEqual(new Date(2026, 1, 12));
  });

  it('setView changes the view', () => {
    const { result } = renderHook(() =>
      useCalendar({
        events: [],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'week',
      }),
    );

    act(() => {
      result.current.setView('month');
    });

    expect(result.current.view).toBe('month');
  });

  it('calls onRangeChange when the visible range changes', () => {
    const onRangeChange = vi.fn();

    const { result } = renderHook(() =>
      useCalendar({
        events: [],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'day',
        onRangeChange,
      }),
    );

    onRangeChange.mockClear();

    act(() => {
      result.current.navigation.goToNext();
    });

    expect(onRangeChange).toHaveBeenCalledWith(
      expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date),
        view: 'day',
      }),
    );
  });

  it('uses controlled date and view when provided', () => {
    const { result } = renderHook(() =>
      useCalendar({
        events: [],
        date: new Date(2026, 5, 15),
        view: 'month',
      }),
    );

    expect(result.current.date).toEqual(new Date(2026, 5, 15));
    expect(result.current.view).toBe('month');
  });

  it('calls onDateChange and onViewChange callbacks', () => {
    const onDateChange = vi.fn();
    const onViewChange = vi.fn();

    const { result } = renderHook(() =>
      useCalendar({
        events: [],
        defaultDate: new Date(2026, 1, 11),
        defaultView: 'day',
        onDateChange,
        onViewChange,
      }),
    );

    act(() => {
      result.current.navigation.goToNext();
    });

    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 1, 12));

    act(() => {
      result.current.setView('month');
    });

    expect(onViewChange).toHaveBeenCalledWith('month');
  });
});
