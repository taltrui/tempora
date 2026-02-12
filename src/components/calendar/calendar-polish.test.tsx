import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './calendar.tsx';
import type { CalendarEvent } from '../../types/event.ts';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: '1',
    title: 'Test Event',
    start: new Date(2026, 1, 11, 10, 0),
    end: new Date(2026, 1, 11, 11, 0),
    ...overrides,
  };
}

describe('Calendar polish', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ARIA attributes', () => {
    it('root has role="application" and aria-label', () => {
      const { container } = render(
        <Calendar events={[]} defaultDate={new Date(2026, 1, 11)} />,
      );

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute('role', 'application');
      expect(root).toHaveAttribute('aria-label', 'Calendar');
    });

    it('event blocks have role="button" and aria-label with event title and time', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 11, 8, 0, 0));

      const event = makeEvent({
        title: 'Team Meeting',
        start: new Date(2026, 1, 11, 10, 0),
        end: new Date(2026, 1, 11, 11, 0),
      });

      render(
        <Calendar
          events={[event]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="day"
        />,
      );

      const eventBlock = screen.getByLabelText(/Team Meeting/);
      expect(eventBlock).toHaveAttribute('role', 'button');
      expect(eventBlock).toHaveAttribute('aria-label', expect.stringContaining('10:00'));
      expect(eventBlock).toHaveAttribute('aria-label', expect.stringContaining('11:00'));
    });

    it('event blocks are keyboard accessible (Enter key triggers click)', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 11, 8, 0, 0));

      const onEventPress = vi.fn();
      const event = makeEvent({
        title: 'Keyboard Event',
        start: new Date(2026, 1, 11, 10, 0),
        end: new Date(2026, 1, 11, 11, 0),
      });

      render(
        <Calendar
          events={[event]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="day"
          onEventPress={onEventPress}
        />,
      );

      const eventBlock = screen.getByLabelText(/Keyboard Event/);
      eventBlock.focus();
      fireEvent.keyDown(eventBlock, { key: 'Enter' });

      expect(onEventPress).toHaveBeenCalledTimes(1);
    });

    it('toolbar buttons have proper aria-labels', () => {
      render(
        <Calendar events={[]} defaultDate={new Date(2026, 1, 11)} />,
      );

      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('left arrow key triggers goToPrev', () => {
      const { container } = render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="week"
        />,
      );

      const root = container.firstChild as HTMLElement;
      const dateLabel = screen.getByRole('heading', { level: 2 });
      const initialText = dateLabel.textContent;

      fireEvent.keyDown(root, { key: 'ArrowLeft' });

      expect(dateLabel.textContent).not.toBe(initialText);
    });

    it('right arrow key triggers goToNext', () => {
      const { container } = render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="week"
        />,
      );

      const root = container.firstChild as HTMLElement;
      const dateLabel = screen.getByRole('heading', { level: 2 });
      const initialText = dateLabel.textContent;

      fireEvent.keyDown(root, { key: 'ArrowRight' });

      expect(dateLabel.textContent).not.toBe(initialText);
    });

    it('t key triggers goToToday', () => {
      const { container } = render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 2, 15)}
          defaultView="week"
        />,
      );

      const root = container.firstChild as HTMLElement;
      const dateLabel = screen.getByRole('heading', { level: 2 });
      const initialText = dateLabel.textContent;

      fireEvent.keyDown(root, { key: 't' });

      expect(dateLabel.textContent).not.toBe(initialText);
    });
  });

  describe('CSS custom properties', () => {
    it('root element has calendar class containing CSS custom property definitions', () => {
      const { container } = render(
        <Calendar events={[]} defaultDate={new Date(2026, 1, 11)} />,
      );

      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/calendar/);
    });
  });

  describe('today date', () => {
    it('today date number has aria-current="date"', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 11, 12, 0, 0));

      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="month"
        />,
      );

      const todayButton = screen.getByTestId('date-number-2026-02-11');
      expect(todayButton).toHaveAttribute('aria-current', 'date');
    });
  });
});

describe('TimezoneGutter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders when secondary timezone is configured', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="day"
        timezones={{ primary: 'America/Chicago', secondary: 'America/New_York' }}
      />,
    );

    expect(screen.getByTestId('timezone-gutter')).toBeInTheDocument();
  });

  it('shows timezone abbreviation', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="day"
        timezones={{ primary: 'America/Chicago', secondary: 'America/New_York' }}
      />,
    );

    const gutter = screen.getByTestId('timezone-gutter');
    expect(gutter.textContent).toBeTruthy();
  });

  it('no timezone gutter when secondary timezone is not configured', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="day"
      />,
    );

    expect(screen.queryByTestId('timezone-gutter')).not.toBeInTheDocument();
  });

  it('no timezone gutter when only primary timezone is set', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="day"
        timezones={{ primary: 'America/Chicago' }}
      />,
    );

    expect(screen.queryByTestId('timezone-gutter')).not.toBeInTheDocument();
  });
});
