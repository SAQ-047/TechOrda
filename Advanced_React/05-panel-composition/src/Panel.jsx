import { useId } from 'react';

export default function Panel({ title, children, actions }) {
  const titleId = useId();
  return (
    <section className="panel" aria-labelledby={titleId}>
      <header className="panel__header">
        <h2 id={titleId}>{title}</h2>
        {actions ? <div className="panel__actions">{actions}</div> : null}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
