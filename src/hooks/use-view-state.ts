import type { CalendarView } from '../types/view.ts';
import { DEFAULT_VIEW } from '../utils/constants.ts';
import { useControllable } from './use-controllable.ts';

export interface UseViewStateProps {
  date?: Date;
  defaultDate?: Date;
  view?: CalendarView;
  defaultView?: CalendarView;
  onDateChange?: (date: Date) => void;
  onViewChange?: (view: CalendarView) => void;
}

export interface ViewState {
  date: Date;
  view: CalendarView;
  setDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
}

export function useViewState(props: UseViewStateProps): ViewState {
  const [date, setDate] = useControllable<Date>({
    value: props.date,
    defaultValue: props.defaultDate ?? new Date(),
    onChange: props.onDateChange,
  });

  const [view, setView] = useControllable<CalendarView>({
    value: props.view,
    defaultValue: props.defaultView ?? DEFAULT_VIEW,
    onChange: props.onViewChange,
  });

  return { date, view, setDate, setView };
}
