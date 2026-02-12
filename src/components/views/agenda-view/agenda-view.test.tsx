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

describe('AgendaView', () => {
  it('renders events grouped by date', () => {
    const events = [
      makeEvent({
        id: 'e1',
        title: 'Morning Meeting',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'e2',
        title: 'Afternoon Call',
        start: new Date(2026, 1, 12, 14, 0),
        end: new Date(2026, 1, 12, 15, 0),
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
      />,
    );

    const dateGroups = screen.getAllByTestId('agenda-date-group');
    expect(dateGroups).toHaveLength(2);
    expect(screen.getByText('Morning Meeting')).toBeInTheDocument();
    expect(screen.getByText('Afternoon Call')).toBeInTheDocument();
  });

  it('skips empty days', () => {
    const events = [
      makeEvent({
        id: 'e1',
        title: 'Day 1 Event',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
      makeEvent({
        id: 'e2',
        title: 'Day 3 Event',
        start: new Date(2026, 1, 13, 14, 0),
        end: new Date(2026, 1, 13, 15, 0),
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
      />,
    );

    const dateGroups = screen.getAllByTestId('agenda-date-group');
    expect(dateGroups).toHaveLength(2);
  });

  it('each event shows color dot, time range, and title', () => {
    const events = [
      makeEvent({
        id: 'e1',
        title: 'Standup',
        start: new Date(2026, 1, 11, 9, 30),
        end: new Date(2026, 1, 11, 10, 0),
        color: 'tomato',
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
      />,
    );

    expect(screen.getByText('Standup')).toBeInTheDocument();
    expect(screen.getByText('9:30 AM – 10:00 AM')).toBeInTheDocument();
    const dot = screen.getByTestId('agenda-color-dot-e1');
    expect(dot).toHaveStyle({ backgroundColor: '#D50000' });
  });

  it('all-day events show "All day" instead of time range', () => {
    const events = [
      makeEvent({
        id: 'allday-1',
        title: 'Holiday',
        start: new Date(2026, 1, 11, 0, 0),
        end: new Date(2026, 1, 12, 0, 0),
        allDay: true,
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
      />,
    );

    expect(screen.getByText('All day')).toBeInTheDocument();
    expect(screen.getByText('Holiday')).toBeInTheDocument();
  });

  it('clicking event fires onEventPress', () => {
    const onEventPress = vi.fn();
    const events = [
      makeEvent({
        id: 'e1',
        title: 'Clickable Event',
        start: new Date(2026, 1, 11, 9, 0),
        end: new Date(2026, 1, 11, 10, 0),
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
        onEventPress={onEventPress}
      />,
    );

    fireEvent.click(screen.getByTestId('agenda-event-e1'));
    expect(onEventPress).toHaveBeenCalledTimes(1);
    expect(onEventPress.mock.calls[0][0].id).toBe('e1');
  });

  it('shows empty state when no events', () => {
    render(
      <Calendar
        events={[]}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
      />,
    );

    expect(screen.getByTestId('agenda-empty-state')).toBeInTheDocument();
  });

  it('events are sorted by start time within each date group', () => {
    const events = [
      makeEvent({
        id: 'late',
        title: 'Late Event',
        start: new Date(2026, 1, 11, 15, 0),
        end: new Date(2026, 1, 11, 16, 0),
      }),
      makeEvent({
        id: 'early',
        title: 'Early Event',
        start: new Date(2026, 1, 11, 8, 0),
        end: new Date(2026, 1, 11, 9, 0),
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
      />,
    );

    const agendaEvents = screen.getAllByTestId(/^agenda-event-/);
    expect(agendaEvents[0]).toHaveAttribute('data-testid', 'agenda-event-early');
    expect(agendaEvents[1]).toHaveAttribute('data-testid', 'agenda-event-late');
  });

  it('respects agendaLength from viewConfig', () => {
    const events = [
      makeEvent({
        id: 'in-range',
        title: 'In Range',
        start: new Date(2026, 1, 13, 9, 0),
        end: new Date(2026, 1, 13, 10, 0),
      }),
      makeEvent({
        id: 'out-of-range',
        title: 'Out Of Range',
        start: new Date(2026, 1, 20, 9, 0),
        end: new Date(2026, 1, 20, 10, 0),
      }),
    ];

    render(
      <Calendar
        events={events}
        defaultDate={new Date(2026, 1, 11)}
        defaultView="agenda"
        viewConfig={{ agenda: { length: 5 } }}
      />,
    );

    expect(screen.getByText('In Range')).toBeInTheDocument();
    expect(screen.queryByText('Out Of Range')).not.toBeInTheDocument();
  });
});
