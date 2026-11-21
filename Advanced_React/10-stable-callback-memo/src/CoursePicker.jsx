import { memo, useEffect, useRef } from 'react';

export default memo(function CoursePicker({ heading, items, selectedIds, options, onSelect }) {
  const effectRuns = useRef(0);
  const effectOutput = useRef(null);

  useEffect(() => {
    effectRuns.current += 1;
    effectOutput.current.textContent = String(effectRuns.current);
  });

  return (
    <section aria-label={heading}>
      <h2>{heading}</h2>
      <p>Запуски эффекта после обновления: <span ref={effectOutput} /></p>
      <ul className="course-list" role="list">
        {items.map(({ id, title, seats }) => {
          const isSelected = selectedIds.includes(id);
          return (
            <li key={id}>
              <button type="button" disabled={isSelected} onClick={() => onSelect(id)}>
                {title}
                {options.showSeats && <span>Мест: {seats}</span>}
                {isSelected && <span>Выбран</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
});
