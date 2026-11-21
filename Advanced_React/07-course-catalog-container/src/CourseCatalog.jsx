import { useState } from 'react';
import CourseListView from './CourseListView.jsx';
import courses from './courses.json';

export default function CourseCatalog() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const searchText = query.trim().toLowerCase();
  const items = courses.filter(({ title }) => title.toLowerCase().includes(searchText));

  return (
    <section aria-labelledby="catalog-heading">
      <h2 id="catalog-heading">Каталог курсов</h2>
      <label>
        Поиск по названию
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p role="status">Выбранный ID: {selectedId ?? '—'}</p>
      <CourseListView items={items} emptyText="Курсы не найдены." onSelect={setSelectedId} />
    </section>
  );
}
