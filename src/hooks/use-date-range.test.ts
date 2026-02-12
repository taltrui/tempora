import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDateRange } from './use-date-range.ts';

describe('useDateRange', () => {
  it('returns week range for week view with weekStartsOn=0', () => {
    const date = new Date(2026, 1, 11);
    const { result } = renderHook(() =>
      useDateRange(date, 'week', { weekStartsOn: 0 }),
    );

    expect(result.current.start).toEqual(new Date(2026, 1, 8, 0, 0, 0, 0));
    expect(result.current.end.getDate()).toBe(14);
    expect(result.current.end.getHours()).toBe(23);
    expect(result.current.end.getMinutes()).toBe(59);
  });

  it('returns month range for month view', () => {
    const date = new Date(2026, 1, 11);
    const { result } = renderHook(() =>
      useDateRange(date, 'month', { weekStartsOn: 0 }),
    );

    expect(result.current.start).toEqual(new Date(2026, 1, 1, 0, 0, 0, 0));
    expect(result.current.end.getDate()).toBe(28);
    expect(result.current.end.getHours()).toBe(23);
    expect(result.current.end.getMinutes()).toBe(59);
  });

  it('returns day range for day view', () => {
    const date = new Date(2026, 1, 11);
    const { result } = renderHook(() =>
      useDateRange(date, 'day', { weekStartsOn: 0 }),
    );

    expect(result.current.start).toEqual(new Date(2026, 1, 11, 0, 0, 0, 0));
    expect(result.current.end.getDate()).toBe(11);
    expect(result.current.end.getHours()).toBe(23);
    expect(result.current.end.getMinutes()).toBe(59);
    expect(result.current.end.getSeconds()).toBe(59);
  });

  it('returns same object reference for identical inputs', () => {
    const date = new Date(2026, 1, 11);
    const opts = { weekStartsOn: 0 as const };

    const { result, rerender } = renderHook(() =>
      useDateRange(date, 'week', opts),
    );

    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });
});
