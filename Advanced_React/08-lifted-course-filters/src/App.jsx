import { useState } from 'react';
import CourseFilters from './CourseFilters.jsx';
import CourseListView from './CourseListView.jsx';
import courses from './courses.json';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const searchText = query.trim().toLowerCase();
  const items = courses.filter((course) => {
    const matchesTitle = course.title.toLowerCase().includes(searchText);
    const matchesCategory = category === '' || course.category === category;
    return matchesTitle && matchesCategory;
  });

  function resetFilters() {
    setQuery('');
    setCategory('');
  }

  return (
    <main>
      <h1>Подъём состояния двух фильтров</h1>
      <CourseFilters
        query={query}
        category={category}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onReset={resetFilters}
      />
      <p role="status">Найдено: {items.length}</p>
      <CourseListView items={items} emptyText="Курсы не найдены." />
    </main>
  );
}
