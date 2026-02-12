import { useState, useCallback } from 'react';
import {
  Calendar,
  type CalendarEvent,
  type EventMovePayload,
  type EventResizePayload,
} from '../../src/index.ts';
import s from '../docs.module.scss';

interface TeamMeta {
  assignee: string;
  project: 'frontend' | 'backend' | 'design' | 'devops';
}

interface RoomMeta {
  room: string;
  capacity: number;
  equipment: string[];
}

const PROJECT_COLORS = {
  frontend: { bg: '#dbeafe', text: '#1e40af' },
  backend: { bg: '#fce7f3', text: '#9d174d' },
  design: { bg: '#fef3c7', text: '#92400e' },
  devops: { bg: '#d1fae5', text: '#065f46' },
};

const AVATAR_COLORS: Record<string, string> = {
  AK: '#6366f1',
  SM: '#ec4899',
  JL: '#f59e0b',
  RW: '#10b981',
  DP: '#8b5cf6',
  TC: '#ef4444',
};

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function d(dayOffset: number, hour: number, minute = 0): Date {
  const monday = getMonday(new Date());
  const result = new Date(monday);
  result.setDate(result.getDate() + dayOffset);
  result.setHours(hour, minute, 0, 0);
  return result;
}

const TEAM_EVENTS: CalendarEvent<TeamMeta>[] = [
  { id: 't1', title: 'Auth refactor', start: d(0, 9, 0), end: d(0, 11, 30), color: 'blueberry', meta: { assignee: 'AK', project: 'frontend' } },
  { id: 't2', title: 'API gateway setup', start: d(0, 13, 0), end: d(0, 15, 0), color: 'flamingo', meta: { assignee: 'SM', project: 'backend' } },
  { id: 't3', title: 'Design system audit', start: d(1, 10, 0), end: d(1, 12, 0), color: 'banana', meta: { assignee: 'JL', project: 'design' } },
  { id: 't4', title: 'CI pipeline fix', start: d(1, 14, 0), end: d(1, 16, 0), color: 'sage', meta: { assignee: 'RW', project: 'devops' } },
  { id: 't5', title: 'Sprint review', start: d(2, 9, 30), end: d(2, 10, 30), color: 'grape', meta: { assignee: 'DP', project: 'frontend' } },
  { id: 't6', title: 'Dashboard v2', start: d(2, 11, 0), end: d(2, 14, 0), color: 'blueberry', meta: { assignee: 'AK', project: 'frontend' } },
  { id: 't7', title: 'DB migration', start: d(3, 9, 0), end: d(3, 11, 0), color: 'flamingo', meta: { assignee: 'TC', project: 'backend' } },
  { id: 't8', title: 'Icon set refresh', start: d(3, 13, 0), end: d(3, 15, 0), color: 'banana', meta: { assignee: 'JL', project: 'design' } },
  { id: 't9', title: 'Perf monitoring', start: d(4, 10, 0), end: d(4, 12, 0), color: 'sage', meta: { assignee: 'RW', project: 'devops' } },
  { id: 't10', title: 'Retro', start: d(4, 15, 0), end: d(4, 16, 0), color: 'graphite', meta: { assignee: 'DP', project: 'frontend' } },
];

const DARK_EVENTS: CalendarEvent[] = [
  { id: 'd1', title: 'Morning standup', start: d(0, 9, 0), end: d(0, 9, 30), color: 'tangerine' },
  { id: 'd2', title: 'Deep work block', start: d(0, 10, 0), end: d(0, 12, 30), color: 'grape' },
  { id: 'd3', title: 'Lunch', start: d(0, 12, 30), end: d(0, 13, 30), color: 'sage' },
  { id: 'd4', title: 'Code review', start: d(0, 14, 0), end: d(0, 16, 0), color: 'blueberry' },
  { id: 'd5', title: 'Yoga', start: d(0, 17, 0), end: d(0, 18, 0), color: 'lavender' },
  { id: 'd6', title: 'Side project', start: d(0, 19, 0), end: d(0, 21, 0), color: 'flamingo' },
];

const WORK_EVENTS: CalendarEvent[] = [
  { id: 'w1', title: 'Standup', start: d(0, 9, 0), end: d(0, 9, 30), color: 'peacock' },
  { id: 'w2', title: 'Focus time', start: d(0, 9, 30), end: d(0, 12, 0), color: 'graphite' },
  { id: 'w3', title: 'Lunch', start: d(0, 12, 0), end: d(0, 13, 0), color: 'sage' },
  { id: 'w4', title: 'Sprint planning', start: d(0, 13, 0), end: d(0, 14, 30), color: 'blueberry' },
  { id: 'w5', title: '1:1 manager', start: d(0, 15, 0), end: d(0, 15, 45), color: 'flamingo' },
  { id: 'w6', title: 'Standup', start: d(1, 9, 0), end: d(1, 9, 30), color: 'peacock' },
  { id: 'w7', title: 'Design review', start: d(1, 10, 0), end: d(1, 11, 30), color: 'grape' },
  { id: 'w8', title: 'Demo prep', start: d(1, 14, 0), end: d(1, 16, 0), color: 'tangerine' },
  { id: 'w9', title: 'Standup', start: d(2, 9, 0), end: d(2, 9, 30), color: 'peacock' },
  { id: 'w10', title: 'Client call', start: d(2, 11, 0), end: d(2, 12, 0), color: 'tomato' },
  { id: 'w11', title: 'Standup', start: d(3, 9, 0), end: d(3, 9, 30), color: 'peacock' },
  { id: 'w12', title: 'Workshop', start: d(3, 13, 0), end: d(3, 15, 0), color: 'lavender' },
  { id: 'w13', title: 'Standup', start: d(4, 9, 0), end: d(4, 9, 30), color: 'peacock' },
  { id: 'w14', title: 'Retro', start: d(4, 15, 0), end: d(4, 16, 30), color: 'banana' },
];

const ROOMS = ['Helios', 'Apollo', 'Nova', 'Orion'];
const ROOM_COLORS: Record<string, string> = {
  Helios: '#f59e0b',
  Apollo: '#3b82f6',
  Nova: '#ec4899',
  Orion: '#10b981',
};

const ROOM_EVENTS: CalendarEvent<RoomMeta>[] = [
  { id: 'r1', title: 'Board meeting', start: d(0, 9, 0), end: d(0, 10, 30), color: 'banana', meta: { room: 'Helios', capacity: 20, equipment: ['projector', 'whiteboard'] } },
  { id: 'r2', title: 'Engineering sync', start: d(0, 11, 0), end: d(0, 12, 0), color: 'peacock', meta: { room: 'Apollo', capacity: 12, equipment: ['display'] } },
  { id: 'r3', title: 'Design crit', start: d(0, 14, 0), end: d(0, 15, 30), color: 'flamingo', meta: { room: 'Nova', capacity: 8, equipment: ['display'] } },
  { id: 'r4', title: 'Candidate interview', start: d(1, 10, 0), end: d(1, 11, 0), color: 'sage', meta: { room: 'Orion', capacity: 4, equipment: ['webcam'] } },
  { id: 'r5', title: 'All-hands', start: d(1, 14, 0), end: d(1, 15, 30), color: 'banana', meta: { room: 'Helios', capacity: 20, equipment: ['projector', 'whiteboard', 'mic'] } },
  { id: 'r6', title: 'Product review', start: d(2, 9, 0), end: d(2, 10, 0), color: 'peacock', meta: { room: 'Apollo', capacity: 12, equipment: ['display'] } },
  { id: 'r7', title: 'Workshop', start: d(2, 13, 0), end: d(2, 15, 0), color: 'flamingo', meta: { room: 'Nova', capacity: 8, equipment: ['whiteboard'] } },
  { id: 'r8', title: 'Lunch & learn', start: d(3, 12, 0), end: d(3, 13, 0), color: 'sage', meta: { room: 'Orion', capacity: 4, equipment: [] } },
  { id: 'r9', title: 'Sprint demo', start: d(3, 15, 0), end: d(3, 16, 30), color: 'banana', meta: { room: 'Helios', capacity: 20, equipment: ['projector'] } },
  { id: 'r10', title: 'Retro', start: d(4, 14, 0), end: d(4, 15, 0), color: 'peacock', meta: { room: 'Apollo', capacity: 12, equipment: ['display'] } },
];

function TeamEventContent({ event }: { event: CalendarEvent<TeamMeta> }) {
  const initials = event.meta?.assignee ?? '??';
  const project = event.meta?.project ?? 'frontend';
  const pc = PROJECT_COLORS[project];
  const ac = AVATAR_COLORS[initials] ?? '#6b7280';

  return (
    <div className={s.teamEvent}>
      <div className={s.teamAvatar} style={{ background: ac }}>
        {initials}
      </div>
      <div className={s.teamInfo}>
        <div className={s.teamTitle}>{event.title}</div>
        <div className={s.teamTag} style={{ background: pc.bg, color: pc.text }}>
          {project}
        </div>
      </div>
    </div>
  );
}

function RoomEventContent({ event }: { event: CalendarEvent<RoomMeta> }) {
  const room = event.meta?.room ?? ROOMS[0];
  const rc = ROOM_COLORS[room] ?? '#6b7280';

  return (
    <div style={{ padding: '2px 0' }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.3 }}>{event.title}</div>
      <div className={s.roomBadge} style={{ background: `${rc}18`, color: rc }}>
        <span className={s.roomDot} style={{ background: rc }} />
        {room}
      </div>
    </div>
  );
}

export function ShowcaseSection() {
  const [teamEvents, setTeamEvents] = useState(TEAM_EVENTS);
  const [roomEvents, setRoomEvents] = useState(ROOM_EVENTS);

  const handleTeamMove = useCallback((payload: EventMovePayload<TeamMeta>) => {
    setTeamEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleTeamResize = useCallback((payload: EventResizePayload<TeamMeta>) => {
    setTeamEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  const handleRoomMove = useCallback((payload: EventMovePayload<RoomMeta>) => {
    setRoomEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end, allDay: payload.allDay }
          : e
      )
    );
  }, []);

  const handleRoomResize = useCallback((payload: EventResizePayload<RoomMeta>) => {
    setRoomEvents(prev =>
      prev.map(e =>
        e.id === payload.event.id
          ? { ...e, start: payload.start, end: payload.end }
          : e
      )
    );
  }, []);

  return (
    <section className={s.section} id="showcase">
      <div className={s.sectionEyebrow}>Examples</div>
      <h2 className={s.sectionTitle}>Built for real apps</h2>
      <p className={s.sectionDesc}>
        Four fully interactive examples showing how Tempora adapts to different use cases
        through custom slots, typed metadata, CSS theming, and config options.
      </p>

      <div className={s.showcaseGrid}>
        <div className={s.showcaseCard}>
          <div className={s.showcaseHeader}>
            <div className={s.showcaseIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
              &#x1f465;
            </div>
            <div className={s.showcaseLabel}>
              Team Schedule
              <span>Custom event content with avatars and project tags</span>
            </div>
          </div>
          <div className={s.showcaseBody}>
            <Calendar<TeamMeta>
              events={teamEvents}
              defaultView="week"
              weekStartsOn={1}
              height={420}
              onEventMove={handleTeamMove}
              onEventResize={handleTeamResize}
              slots={{
                eventContent: ({ event }) => <TeamEventContent event={event} />,
              }}
            />
          </div>
        </div>

        <div className={s.showcaseCard}>
          <div className={s.showcaseHeader}>
            <div className={s.showcaseIcon} style={{ background: '#1c1917', color: '#fafaf9' }}>
              &#x1f319;
            </div>
            <div className={s.showcaseLabel}>
              Dark Mode
              <span>CSS variable theming with warm dark palette</span>
            </div>
          </div>
          <div className={s.showcaseBody}>
            <Calendar
              events={DARK_EVENTS}
              defaultView="day"
              weekStartsOn={1}
              height={420}
              className={s.darkCalendar}
              timeGrid={{ startHour: 8, endHour: 22, slotDuration: 30, slotHeight: 48, snapDuration: 15 }}
            />
          </div>
        </div>

        <div className={s.showcaseCard}>
          <div className={s.showcaseHeader}>
            <div className={s.showcaseIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
              &#x1f4bc;
            </div>
            <div className={s.showcaseLabel}>
              Compact Work Hours
              <span>timeGrid config showing only 9 AM &ndash; 5 PM</span>
            </div>
          </div>
          <div className={s.showcaseBody}>
            <Calendar
              events={WORK_EVENTS}
              defaultView="week"
              weekStartsOn={1}
              height={420}
              timeGrid={{ startHour: 9, endHour: 17, slotDuration: 30, slotHeight: 48, snapDuration: 15 }}
            />
          </div>
        </div>

        <div className={s.showcaseCard}>
          <div className={s.showcaseHeader}>
            <div className={s.showcaseIcon} style={{ background: '#fce7f3', color: '#db2777' }}>
              &#x1f3e2;
            </div>
            <div className={s.showcaseLabel}>
              Meeting Room Booking
              <span>Typed metadata with room badges and capacity info</span>
            </div>
          </div>
          <div className={s.showcaseBody}>
            <Calendar<RoomMeta>
              events={roomEvents}
              defaultView="week"
              weekStartsOn={1}
              height={420}
              onEventMove={handleRoomMove}
              onEventResize={handleRoomResize}
              timeGrid={{ startHour: 8, endHour: 18, slotDuration: 30, slotHeight: 48, snapDuration: 15 }}
              slots={{
                eventContent: ({ event }) => <RoomEventContent event={event} />,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
