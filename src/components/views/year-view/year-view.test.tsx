import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from '../../calendar/calendar.tsx';

afterEach(() => {
  vi.useRealTimers();
});

describe('YearView', () => {
  it('renders 12 mini-calendars', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
      />,
    );

    const miniCalendars = screen.getAllByTestId(/^mini-calendar-\d+$/);
    expect(miniCalendars).toHaveLength(12);
  });

  it('each mini-calendar has a month title', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
      />,
    );

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    for (const month of months) {
      expect(screen.getByText(month)).toBeInTheDocument();
    }
  });

  it('today is highlighted', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 11, 12, 0, 0));

    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
      />,
    );

    const todayCell = screen.getByTestId('mini-day-2026-02-11');
    expect(todayCell.className).toMatch(/today/);
  });

  it('clicking a date fires onDateClick with the clicked date and year view', () => {
    const onDateClick = vi.fn();

    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
        onDateClick={onDateClick}
      />,
    );

    fireEvent.click(screen.getByTestId('mini-day-2026-03-15'));
    expect(onDateClick).toHaveBeenCalledTimes(1);
    expect(onDateClick.mock.calls[0][0].getMonth()).toBe(2);
    expect(onDateClick.mock.calls[0][0].getDate()).toBe(15);
    expect(onDateClick.mock.calls[0][1]).toBe('year');
  });

  it('mini-calendar has correct weekday headers based on weekStartsOn', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
        weekStartsOn={1}
      />,
    );

    const headerGroups = screen.getAllByTestId('mini-weekday-row');
    const firstRow = headerGroups[0];
    const headers = firstRow.textContent;
    expect(headers).toBe('MTWTFSS');
  });

  it('mini-calendar shows correct number of day cells', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
      />,
    );

    const janCalendar = screen.getByTestId('mini-calendar-0');
    const dayCells = janCalendar.querySelectorAll('[data-testid^="mini-day-"]');
    expect(dayCells.length % 7).toBe(0);
    expect(dayCells.length).toBeGreaterThanOrEqual(28);
    expect(dayCells.length).toBeLessThanOrEqual(42);
  });

  it('outside-month dates are dimmed', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="year"
      />,
    );

    const janCalendar = screen.getByTestId('mini-calendar-0');
    const dec28 = janCalendar.querySelector('[data-testid="mini-day-2025-12-28"]');
    expect(dec28).toBeTruthy();
    expect(dec28!.className).toMatch(/outside/);
  });
});
