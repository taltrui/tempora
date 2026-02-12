import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import {
  CalendarConfigContext,
  CalendarStateContext,
  type CalendarConfigValue,
  type CalendarStateValue,
  type CalendarContextValue,
} from '../../context/calendar-context.ts';
import { Toolbar } from './toolbar.tsx';
import { DEFAULT_TIME_GRID_CONFIG } from '../../utils/constants.ts';

function createMockContext(
  overrides: Partial<CalendarContextValue> = {},
): CalendarContextValue {
  return {
    date: new Date(2026, 1, 11),
    view: 'week',
    visibleRange: {
      start: new Date(2026, 1, 8),
      end: new Date(2026, 1, 14),
    },
    visibleEvents: [],
    navigation: {
      goToToday: vi.fn(),
      goToPrev: vi.fn(),
      goToNext: vi.fn(),
      goToDate: vi.fn(),
    },
    setView: vi.fn(),
    dateLabel: 'Feb 8 \u2013 14, 2026',
    weekStartsOn: 0,
    timeGridConfig: DEFAULT_TIME_GRID_CONFIG,
    monthMaxEvents: 4,
    draggableEnabled: false,
    resizableEnabled: false,
    ...overrides,
  };
}

function renderWithContext(
  ui: ReactNode,
  ctx: CalendarContextValue,
) {
  const configValue: CalendarConfigValue = {
    weekStartsOn: ctx.weekStartsOn,
    timeGridConfig: ctx.timeGridConfig,
    monthMaxEvents: ctx.monthMaxEvents,
    timezones: ctx.timezones,
    viewConfig: ctx.viewConfig,
    locale: ctx.locale,
    slots: ctx.slots,
    draggableEnabled: ctx.draggableEnabled,
    resizableEnabled: ctx.resizableEnabled,
    onEventPress: ctx.onEventPress,
    onEventDoubleClick: ctx.onEventDoubleClick,
    onSlotPress: ctx.onSlotPress,
    onDateClick: ctx.onDateClick,
    onShowMore: ctx.onShowMore,
    onEventMove: ctx.onEventMove,
    onEventResize: ctx.onEventResize,
  };

  const stateValue: CalendarStateValue = {
    date: ctx.date,
    view: ctx.view,
    visibleRange: ctx.visibleRange,
    visibleEvents: ctx.visibleEvents,
    navigation: ctx.navigation,
    setView: ctx.setView,
    dateLabel: ctx.dateLabel,
  };

  return render(
    <CalendarConfigContext.Provider value={configValue}>
      <CalendarStateContext.Provider value={stateValue}>
        {ui}
      </CalendarStateContext.Provider>
    </CalendarConfigContext.Provider>,
  );
}

describe('Toolbar', () => {
  it('renders Today, Previous, and Next buttons', () => {
    const ctx = createMockContext();
    renderWithContext(<Toolbar />, ctx);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('clicking Today calls navigation.goToToday', async () => {
    const user = userEvent.setup();
    const ctx = createMockContext();
    renderWithContext(<Toolbar />, ctx);

    await user.click(screen.getByText('Today'));
    expect(ctx.navigation.goToToday).toHaveBeenCalledTimes(1);
  });

  it('clicking Previous calls navigation.goToPrev', async () => {
    const user = userEvent.setup();
    const ctx = createMockContext();
    renderWithContext(<Toolbar />, ctx);

    await user.click(screen.getByLabelText('Previous'));
    expect(ctx.navigation.goToPrev).toHaveBeenCalledTimes(1);
  });

  it('clicking Next calls navigation.goToNext', async () => {
    const user = userEvent.setup();
    const ctx = createMockContext();
    renderWithContext(<Toolbar />, ctx);

    await user.click(screen.getByLabelText('Next'));
    expect(ctx.navigation.goToNext).toHaveBeenCalledTimes(1);
  });

  it('displays the correct dateLabel', () => {
    const ctx = createMockContext({ dateLabel: 'March 2026' });
    renderWithContext(<Toolbar />, ctx);

    expect(screen.getByText('March 2026')).toBeInTheDocument();
  });

  it('renders view selector buttons', () => {
    const ctx = createMockContext();
    renderWithContext(<Toolbar />, ctx);

    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Agenda')).toBeInTheDocument();
  });

  it('clicking a view button calls setView with correct view', async () => {
    const user = userEvent.setup();
    const ctx = createMockContext();
    renderWithContext(<Toolbar />, ctx);

    await user.click(screen.getByText('Month'));
    expect(ctx.setView).toHaveBeenCalledWith('month');

    await user.click(screen.getByText('Day'));
    expect(ctx.setView).toHaveBeenCalledWith('day');
  });

  it('active view button has active styling class', () => {
    const ctx = createMockContext({ view: 'week' });
    renderWithContext(<Toolbar />, ctx);

    const weekButton = screen.getByText('Week');
    const dayButton = screen.getByText('Day');

    expect(weekButton.className).toMatch(/active/);
    expect(dayButton.className).not.toMatch(/active/);
  });

  it('renders custom toolbar slot when provided', () => {
    const CustomToolbar = () => <div data-testid="custom-toolbar">Custom</div>;
    const ctx = createMockContext({
      slots: { toolbar: CustomToolbar },
    });
    renderWithContext(<Toolbar />, ctx);

    expect(screen.getByTestId('custom-toolbar')).toBeInTheDocument();
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
  });
});
