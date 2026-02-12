import { useState } from 'react';
import { CodeBlock } from '../code-block.tsx';
import s from '../docs.module.scss';

export function InstallSection() {
  const [tab, setTab] = useState<'pnpm' | 'npm' | 'yarn'>('pnpm');

  const commands = {
    pnpm: 'pnpm add tempora @dnd-kit/core @dnd-kit/sortable date-fns',
    npm: 'npm install tempora @dnd-kit/core @dnd-kit/sortable date-fns',
    yarn: 'yarn add tempora @dnd-kit/core @dnd-kit/sortable date-fns',
  };

  return (
    <section className={s.section} id="installation">
      <div className={s.sectionEyebrow}>Getting Started</div>
      <h2 className={s.sectionTitle}>Installation</h2>
      <p className={s.sectionDesc}>
        Install Tempora and its peer dependencies with your preferred package manager.
      </p>
      <div className={s.installTabs}>
        {(['pnpm', 'npm', 'yarn'] as const).map(t => (
          <button
            key={t}
            className={`${s.installTab} ${tab === t ? s.installTabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <CodeBlock>{commands[tab]}</CodeBlock>

      <h3 className={s.subTitle}>Peer Dependencies</h3>
      <table className={s.propsTable}>
        <thead>
          <tr>
            <th>Package</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>react</td><td>{'>= 18.0.0'}</td></tr>
          <tr><td>react-dom</td><td>{'>= 18.0.0'}</td></tr>
          <tr><td>@dnd-kit/core</td><td>^6.3.1</td></tr>
          <tr><td>@dnd-kit/sortable</td><td>^10.0.0</td></tr>
          <tr><td>date-fns</td><td>^4.1.0</td></tr>
        </tbody>
      </table>
    </section>
  );
}
