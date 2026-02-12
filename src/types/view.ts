export type CalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda' | 'n-days';

export interface NDaysConfig {
  count: number;
}

export interface ViewConfig {
  nDays?: NDaysConfig;
  agenda?: { length?: number };
}
