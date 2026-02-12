import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from '../../calendar/calendar.tsx';
import type { CalendarEvent } from '../../../types/event.ts';

function makeEvent(overrides: Partial<CalendarEvent> & { start: Date; end: Date }): CalendarEvent {
  return {
    id: overrides.id ?? '1',
    title: overrides.title ?? 'Test Event',
    ...overrides,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('MonthView', () => {
  it('renders weekday headers', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
      />,
    );

    expect(screen.getByText('SUN')).toBeInTheDocument();
    expect(screen.getByText('MON')).toBeInTheDocument();
    expect(screen.getByText('TUE')).toBeInTheDocument();
    expect(screen.getByText('WED')).toBeInTheDocument();
    expect(screen.getByText('THU')).toBeInTheDocument();
    expect(screen.getByText('FRI')).toBeInTheDocument();
    expect(screen.getByText('SAT')).toBeInTheDocument();
  });

  it('renders correct number of day cells for Feb 2026', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
      />,
    );

    const dayCells = screen.getAllByTestId('day-cell');
    expect(dayCells.length % 7).toBe(0);
    expect(dayCells.length).toBeGreaterThanOrEqual(28);
    expect(dayCells.length).toBeLessThanOrEqual(42);
  });

  it('highlights today', () => {
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
    expect(todayButton.className).toMatch(/today/);
  });

  it('dims outside-month days', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 3, 15)}
        defaultView="month"
      />,
    );

    const outsideDay = screen.getByTestId('date-number-2026-03-29');
    expect(outsideDay.className).toMatch(/outside/);
  });

  it('renders timed event as chip with dot and time and title', () => {
    const event = makeEvent({
      id: 'timed-1',
      title: 'Team Meeting',
      start: new Date(2026, 1, 11, 9, 30),
      end: new Date(2026, 1, 11, 10, 30),
      color: 'peacock',
    });

    render(
      <Calendar
        events={[event]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
      />,
    );

    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    expect(screen.getByText('9:30 AM')).toBeInTheDocument();
  });

  it('renders all-day event as chip with colored background', () => {
    const event = makeEvent({
      id: 'allday-1',
      title: 'Holiday',
      start: new Date(2026, 1, 11, 0, 0),
      end: new Date(2026, 1, 12, 0, 0),
      allDay: true,
      color: 'tomato',
    });

    render(
      <Calendar
        events={[event]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
      />,
    );

    const chip = screen.getByText('Holiday').closest('[data-testid="event-chip"]');
    expect(chip).toBeInTheDocument();
    expect(chip!.className).toMatch(/allDay/);
  });

  it('shows "+N more" when events exceed monthMaxEvents', () => {
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        id: `evt-${i}`,
        title: `Event ${i}`,
        start: new Date(2026, 1, 11, 9 + i, 0),
        end: new Date(2026, 1, 11, 10 + i, 0),
      }),
    );

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
        monthMaxEvents={3}
      />,
    );

    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('fires onDateClick when date number is clicked', () => {
    const onDateClick = vi.fn();

    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
        onDateClick={onDateClick}
      />,
    );

    fireEvent.click(screen.getByTestId('date-number-2026-02-15'));
    expect(onDateClick).toHaveBeenCalledTimes(1);
    expect(onDateClick.mock.calls[0][0].getDate()).toBe(15);
    expect(onDateClick.mock.calls[0][1]).toBe('month');
  });

  it('fires onShowMore when "+N more" is clicked', () => {
    const onShowMore = vi.fn();
    const events = Array.from({ length: 5 }, (_, i) =>
      makeEvent({
        id: `evt-${i}`,
        title: `Event ${i}`,
        start: new Date(2026, 1, 11, 9 + i, 0),
        end: new Date(2026, 1, 11, 10 + i, 0),
      }),
    );

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
        monthMaxEvents={3}
        onShowMore={onShowMore}
      />,
    );

    fireEvent.click(screen.getByText('+2 more'));
    expect(onShowMore).toHaveBeenCalledTimes(1);
    expect(onShowMore.mock.calls[0][0].getDate()).toBe(11);
    expect(onShowMore.mock.calls[0][1]).toHaveLength(5);
  });

  it('renders timed event with hour-only format when minutes are 0', () => {
    const event = makeEvent({
      id: 'on-hour',
      title: 'Standup',
      start: new Date(2026, 1, 11, 9, 0),
      end: new Date(2026, 1, 11, 9, 30),
    });

    render(
      <Calendar
        events={[event]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
      />,
    );

    expect(screen.getByText('9 AM')).toBeInTheDocument();
  });

  it('respects weekStartsOn for header order', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
        weekStartsOn={1}
      />,
    );

    const headers = screen.getAllByTestId('weekday-header');
    expect(headers[0].textContent).toBe('MON');
    expect(headers[6].textContent).toBe('SUN');
  });

  it('renders event chip with correct event color dot for timed events', () => {
    const event = makeEvent({
      id: 'colored',
      title: 'Colored Event',
      start: new Date(2026, 1, 11, 10, 0),
      end: new Date(2026, 1, 11, 11, 0),
      color: 'tomato',
    });

    render(
      <Calendar
        events={[event]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="month"
      />,
    );

    const dot = screen.getByTestId('event-chip-dot-colored');
    expect(dot).toHaveStyle({ backgroundColor: '#D50000' });
  });
});
