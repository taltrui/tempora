import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { startOfDay } from 'date-fns';
import { useNavigation } from './use-navigation.ts';
import type { CalendarView } from '../types/view.ts';
import type { UseNavigationOptions } from './use-navigation.ts';

function setup(
  initialDate: Date,
  view: CalendarView,
  opts?: Partial<UseNavigationOptions>,
) {
  const setDate = vi.fn();
  const mergedOpts: UseNavigationOptions = {
    weekStartsOn: 0,
    ...opts,
  };

  const { result } = renderHook(() =>
    useNavigation(initialDate, view, setDate, mergedOpts),
  );

  return { result, setDate };
}

describe('useNavigation', () => {
  describe('day view', () => {
    it('goToNext from Feb 11 2026 goes to Feb 12', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'day');

      act(() => {
        result.current.goToNext();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 1, 12));
    });

    it('goToPrev from Feb 11 2026 goes to Feb 10', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'day');

      act(() => {
        result.current.goToPrev();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 1, 10));
    });
  });

  describe('week view', () => {
    it('goToNext from Feb 11 2026 goes to Feb 18', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'week');

      act(() => {
        result.current.goToNext();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 1, 18));
    });

    it('goToPrev from Feb 11 2026 goes to Feb 4', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'week');

      act(() => {
        result.current.goToPrev();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 1, 4));
    });
  });

  describe('month view', () => {
    it('goToNext from Feb 2026 goes to March 2026', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'month');

      act(() => {
        result.current.goToNext();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 2, 11));
    });

    it('goToPrev from Feb 2026 goes to January 2026', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'month');

      act(() => {
        result.current.goToPrev();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 0, 11));
    });
  });

  describe('year view', () => {
    it('goToNext from 2026 goes to 2027', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'year');

      act(() => {
        result.current.goToNext();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2027, 1, 11));
    });

    it('goToPrev from 2026 goes to 2025', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'year');

      act(() => {
        result.current.goToPrev();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2025, 1, 11));
    });
  });

  describe('n-days view', () => {
    it('goToNext with nDays=4 adds 4 days', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'n-days', {
        nDays: 4,
      });

      act(() => {
        result.current.goToNext();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 1, 15));
    });

    it('goToPrev with nDays=4 subtracts 4 days', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'n-days', {
        nDays: 4,
      });

      act(() => {
        result.current.goToPrev();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 1, 7));
    });
  });

  describe('agenda view', () => {
    it('goToNext with agendaLength=30 adds 30 days', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'agenda', {
        agendaLength: 30,
      });

      act(() => {
        result.current.goToNext();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 2, 13));
    });

    it('goToPrev with agendaLength=30 subtracts 30 days', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'agenda', {
        agendaLength: 30,
      });

      act(() => {
        result.current.goToPrev();
      });

      expect(setDate).toHaveBeenCalledWith(new Date(2026, 0, 12));
    });
  });

  describe('goToToday', () => {
    it('sets date to start of today', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'day');

      act(() => {
        result.current.goToToday();
      });

      expect(setDate).toHaveBeenCalledWith(startOfDay(new Date()));
    });
  });

  describe('goToDate', () => {
    it('sets date to the specified date', () => {
      const { result, setDate } = setup(new Date(2026, 1, 11), 'day');
      const target = new Date(2026, 5, 15);

      act(() => {
        result.current.goToDate(target);
      });

      expect(setDate).toHaveBeenCalledWith(target);
    });
  });
});
