import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCurrentTime } from './use-current-time.ts';

describe('useCurrentTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a Date object', () => {
    const { result } = renderHook(() => useCurrentTime());
    expect(result.current).toBeInstanceOf(Date);
  });

  it('updates after 60 seconds', () => {
    vi.setSystemTime(new Date(2026, 1, 11, 10, 0, 0));

    const { result } = renderHook(() => useCurrentTime());
    expect(result.current.getMinutes()).toBe(0);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.getMinutes()).toBe(1);
  });

  it('does not update when enabled is false', () => {
    const start = new Date(2026, 1, 11, 10, 0, 0);
    vi.setSystemTime(start);

    const { result } = renderHook(() => useCurrentTime(false));
    expect(result.current.getMinutes()).toBe(0);

    act(() => {
      vi.setSystemTime(new Date(2026, 1, 11, 10, 1, 0));
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.getMinutes()).toBe(0);
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() => useCurrentTime());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
