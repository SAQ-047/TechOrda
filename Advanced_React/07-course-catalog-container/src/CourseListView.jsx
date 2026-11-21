export default function CourseListView({ items, emptyText, onSelect }) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul className="course-list">
      {items.map(({ id, title, category, seats }) => (
        <li key={id}>
          <button type="button" onClick={() => onSelect(id)}>
            <strong>{title}</strong>
            <span>{category} · Мест: {seats}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
