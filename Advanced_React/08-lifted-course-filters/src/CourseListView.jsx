export default function CourseListView({ items, emptyText }) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul className="course-list" role="list">
      {items.map(({ id, title, category, seats }) => (
        <li key={id}>
          <strong>{title}</strong>
          <span>{category} · Мест: {seats}</span>
        </li>
      ))}
    </ul>
  );
}
