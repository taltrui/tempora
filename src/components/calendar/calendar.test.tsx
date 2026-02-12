import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('Calendar', () => {
  it('renders with default props', () => {
    const { container } = render(
      <Calendar events={[]} defaultDate={new Date(2026, 1, 11)} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows week view by default', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="week"
      />,
    );

    const weekButton = screen.getByText('Week');
    expect(weekButton.className).toMatch(/active/);
  });

  it('renders 7 day columns', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="week"
      />,
    );

    const dayHeaders = screen.getAllByTestId('day-header');
    expect(dayHeaders).toHaveLength(7);
  });

  it('renders events in the correct day column', () => {
    const event = makeEvent({
      id: '1',
      title: 'Wednesday Meeting',
      start: new Date(2026, 1, 11, 10, 0),
      end: new Date(2026, 1, 11, 11, 0),
    });

    render(
      <Calendar
        events={[event]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="week"
      />,
    );

    expect(screen.getByText('Wednesday Meeting')).toBeInTheDocument();
  });

  it('renders toolbar with navigation', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="week"
      />,
    );

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        className="my-calendar"
      />,
    );

    expect(container.firstChild).toHaveClass('my-calendar');
  });

  it('applies custom height style', () => {
    const { container } = render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        height="600px"
      />,
    );

    expect(container.firstChild).toHaveStyle({ height: '600px' });
  });

  describe('day view', () => {
    it('renders a single day column', () => {
      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="day"
        />,
      );

      const dayHeaders = screen.getAllByTestId('day-header');
      expect(dayHeaders).toHaveLength(1);
    });

    it('shows events for the given date', () => {
      const event = makeEvent({
        id: '1',
        title: 'Day Event',
        start: new Date(2026, 1, 11, 14, 0),
        end: new Date(2026, 1, 11, 15, 0),
      });

      render(
        <Calendar
          events={[event]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="day"
        />,
      );

      expect(screen.getByText('Day Event')).toBeInTheDocument();
    });
  });

  describe('n-days view', () => {
    it('renders 4 day columns when nDays=4', () => {
      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="n-days"
          viewConfig={{ nDays: { count: 4 } }}
        />,
      );

      const dayHeaders = screen.getAllByTestId('day-header');
      expect(dayHeaders).toHaveLength(4);
    });

    it('renders 3 day columns when nDays=3', () => {
      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="n-days"
          viewConfig={{ nDays: { count: 3 } }}
        />,
      );

      const dayHeaders = screen.getAllByTestId('day-header');
      expect(dayHeaders).toHaveLength(3);
    });

    it('defaults to 4 day columns when nDays not specified', () => {
      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="n-days"
        />,
      );

      const dayHeaders = screen.getAllByTestId('day-header');
      expect(dayHeaders).toHaveLength(4);
    });
  });

  describe('current time indicator', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders in todays column', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 11, 14, 30, 0));

      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 11)}
          defaultView="day"
        />,
      );

      expect(screen.getByTestId('current-time-indicator')).toBeInTheDocument();
    });

    it('does not render on non-today columns', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 11, 14, 30, 0));

      render(
        <Calendar
          events={[]}
          defaultDate={new Date(2026, 1, 15)}
          defaultView="day"
        />,
      );

      expect(screen.queryByTestId('current-time-indicator')).not.toBeInTheDocument();
    });
  });
});
