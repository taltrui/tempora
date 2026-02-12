export interface TimeRange {
  start: Date;
  end: Date;
}

export interface TimeSlot {
  start: number;
  end: number;
  label: string;
}

export interface DayColumn {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
}

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimezoneConfig {
  primary: string;
  secondary?: string;
}

export interface TimeGridConfig {
  startHour: number;
  endHour: number;
  slotDuration: number;
  slotHeight: number;
  snapDuration: number;
}
