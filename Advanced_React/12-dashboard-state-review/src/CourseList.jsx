export default function CourseList({ items, selectedId, favoriteIds, onSelect, onToggleFavorite }) {
  if (items.length === 0) {
    return <p>Курсы не найдены.</p>;
  }

  return (
    <ul className="course-list" role="list">
      {items.map(({ id, title, category, seats }) => {
        const isFavorite = favoriteIds.includes(id);

        return (
          <li key={id}>
            <button
              type="button"
              className="course-choice"
              aria-current={id === selectedId ? 'true' : undefined}
              onClick={() => onSelect(id)}
            >
              <strong>{title}</strong>
              <span>{category} · Мест: {seats}</span>
            </button>
            <button
              type="button"
              aria-label={`Избранное: ${title}`}
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(id)}
            >
              Избранное <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
