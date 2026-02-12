import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEventLayout } from './use-event-layout.ts';
import type { CalendarEvent } from '../types/event.ts';
import { DEFAULT_TIME_GRID_CONFIG } from '../utils/constants.ts';

const feb11 = new Date(2026, 1, 11);
const config = DEFAULT_TIME_GRID_CONFIG;

describe('useEventLayout', () => {
  it('returns layout for given events and date', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Meeting',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      },
    ];

    const { result } = renderHook(() => useEventLayout(events, feb11, config));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].column).toBe(0);
    expect(result.current[0].totalColumns).toBe(1);
    expect(result.current[0].top).toBe(864);
    expect(result.current[0].height).toBe(96);
  });

  it('memoizes result when inputs do not change', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Meeting',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      },
    ];

    const { result, rerender } = renderHook(() =>
      useEventLayout(events, feb11, config),
    );

    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });
});
