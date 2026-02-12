import type { CalendarEvent, EventColor } from '../src/index.ts';

export const COLORS: EventColor[] = [
  'tomato', 'flamingo', 'tangerine', 'banana', 'sage',
  'basil', 'peacock', 'blueberry', 'lavender', 'grape', 'graphite',
];

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function createDate(dayOffset: number, hour: number, minute = 0): Date {
  const monday = getMonday(new Date());
  const d = new Date(monday);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

let _nextId = 100;
export function nextId(): number {
  return _nextId++;
}

export const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', start: createDate(0, 9, 0), end: createDate(0, 9, 30), color: 'peacock', location: 'Room 3A' },
  { id: '2', title: 'Sprint Planning', start: createDate(0, 10, 0), end: createDate(0, 11, 30), color: 'blueberry' },
  { id: '3', title: 'Lunch with Sarah', start: createDate(0, 12, 0), end: createDate(0, 13, 0), color: 'sage', location: 'Cafe Milano' },
  { id: '4', title: 'Design Review', start: createDate(1, 14, 0), end: createDate(1, 15, 30), color: 'grape' },
  { id: '5', title: 'Product Demo', start: createDate(1, 10, 0), end: createDate(1, 11, 0), color: 'tangerine', location: 'Main Conference Room' },
  { id: '6', title: '1:1 with Manager', start: createDate(2, 11, 0), end: createDate(2, 11, 45), color: 'flamingo' },
  { id: '7', title: 'Code Review', start: createDate(2, 14, 0), end: createDate(2, 16, 0), color: 'basil' },
  { id: '8', title: 'Team Standup', start: createDate(1, 9, 0), end: createDate(1, 9, 30), color: 'peacock' },
  { id: '9', title: 'Team Standup', start: createDate(2, 9, 0), end: createDate(2, 9, 30), color: 'peacock' },
  { id: '10', title: 'Team Standup', start: createDate(3, 9, 0), end: createDate(3, 9, 30), color: 'peacock' },
  { id: '11', title: 'Team Standup', start: createDate(4, 9, 0), end: createDate(4, 9, 30), color: 'peacock' },
  { id: '12', title: 'React Workshop', start: createDate(3, 13, 0), end: createDate(3, 15, 0), color: 'lavender', location: 'Training Room B' },
  { id: '13', title: 'Client Call', start: createDate(3, 10, 0), end: createDate(3, 11, 0), color: 'tomato', location: 'Zoom' },
  { id: '14', title: 'Retrospective', start: createDate(4, 15, 0), end: createDate(4, 16, 0), color: 'banana' },
  { id: '15', title: 'Happy Hour', start: createDate(4, 17, 0), end: createDate(4, 18, 30), color: 'sage', location: 'The Pub' },
  { id: '16', title: 'Yoga Class', start: createDate(2, 7, 0), end: createDate(2, 8, 0), color: 'graphite' },
  { id: '17', title: 'Company All-Hands', start: createDate(3, 16, 0), end: createDate(3, 17, 0), color: 'blueberry', location: 'Auditorium' },
  { id: '18', title: 'Conference Day', start: createDate(5, 0, 0), end: createDate(5, 23, 59), allDay: true, color: 'tangerine' },
  { id: '19', title: 'Team Offsite', start: createDate(5, 0, 0), end: createDate(6, 23, 59), allDay: true, color: 'basil' },
  { id: '20', title: 'Deep Work Block', start: createDate(1, 13, 0), end: createDate(1, 16, 0), color: 'graphite', draggable: false, resizable: false },
];
