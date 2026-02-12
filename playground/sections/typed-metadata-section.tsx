import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function TypedMetadataSection() {
  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="typed-metadata">
      <div className={s.sectionEyebrow}>TypeScript</div>
      <h2 className={s.sectionTitle}>Typed metadata</h2>
      <p className={s.sectionDesc}>
        Use the <code className={s.inlineCode}>TMeta</code> generic parameter to attach typed data to your events.
        The type flows through to all callbacks and slot components.
      </p>
      <CodeBlock>{`interface MyMeta {
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

const events: CalendarEvent<MyMeta>[] = [
  {
    id: '1',
    title: 'Fix login bug',
    start: new Date(2026, 0, 12, 10, 0),
    end: new Date(2026, 0, 12, 11, 0),
    meta: { priority: 'high', assignee: 'Alice' },
  },
];

<Calendar<MyMeta>
  events={events}
  onEventPress={(event) => {
    // event.meta is typed as MyMeta | undefined
    console.log(event.meta?.assignee);
  }}
  slots={{
    eventContent: ({ event }) => (
      <div>
        {event.title}
        {event.meta?.priority === 'high' && <span>!!!</span>}
      </div>
    ),
  }}
/>`}</CodeBlock>
    </section>
  );
}
