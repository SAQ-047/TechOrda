import { useState } from 'react';
import CourseCatalog from './CourseCatalog.jsx';
import CourseListView from './CourseListView.jsx';
import courses from './courses.json';

export default function App() {
  const [exampleSelectedId, setExampleSelectedId] = useState(null);

  return (
    <main>
      <h1>Контейнер каталога и представление</h1>
      <CourseCatalog />
      <div className="examples">
        <section aria-labelledby="full-heading">
          <h2 id="full-heading">Представление с полным списком</h2>
          <p role="status">ID из onSelect: {exampleSelectedId ?? '—'}</p>
          <CourseListView items={courses} emptyText="Список курсов пуст." onSelect={setExampleSelectedId} />
        </section>
        <section aria-labelledby="empty-heading">
          <h2 id="empty-heading">Представление с пустым массивом</h2>
          <CourseListView items={[]} emptyText="Список курсов пуст." onSelect={setExampleSelectedId} />
        </section>
      </div>
    </main>
  );
}
