import s from './docs.module.scss';

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className={s.codeBlock}>
      <code>{children.trim()}</code>
    </pre>
  );
}
