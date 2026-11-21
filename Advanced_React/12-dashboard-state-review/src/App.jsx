import { useState } from 'react';
import CourseList from './CourseList.jsx';
import courses from './courses.json';
import useFavorites from './useFavorites.js';

function SelectedCoursePanel({ course, hiddenBySearch }) {
  return (
    <section aria-labelledby="selected-heading">
      <h2 id="selected-heading">Выбранный курс</h2>
      {course ? (
        <>
          <h3>{course.title}</h3>
          <p>{course.category} · Мест: {course.seats}</p>
          {hiddenBySearch && <p>Выбранный курс вне результатов текущего поиска.</p>}
        </>
      ) : <p>Курс ещё не выбран.</p>}
    </section>
  );
}

function FavoritesPanel({ items, onClear }) {
  const isEmpty = items.length === 0;

  return (
    <section aria-labelledby="favorites-heading">
      <h2 id="favorites-heading">Избранное ({items.length})</h2>
      <button type="button" onClick={onClear} disabled={isEmpty}>Очистить избранное</button>
      {isEmpty ? (
        <p>Избранных курсов пока нет.</p>
      ) : (
        <ul>{items.map(({ id, title }) => <li key={id}>{title}</li>)}</ul>
      )}
    </section>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { ids: favoriteIds, toggle, clear } = useFavorites();

  const searchText = query.trim().toLowerCase();
  const visibleCourses = courses.filter(({ title }) => title.toLowerCase().includes(searchText));
  const selectedCourse = courses.find(({ id }) => id === selectedId);
  const favoriteCourses = courses.filter(({ id }) => favoriteIds.includes(id));
  const hiddenBySearch = Boolean(selectedCourse) && !visibleCourses.some(({ id }) => id === selectedId);

  return (
    <main>
      <h1>Обзор каталога курсов</h1>
      <div className="dashboard">
        <section aria-labelledby="catalog-heading">
          <h2 id="catalog-heading">Каталог</h2>
          <div className="search">
            <label>
              Поиск по названию
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <button type="button" onClick={() => setQuery('')} disabled={query === ''}>Очистить поиск</button>
          </div>
          <p role="status">Найдено: {visibleCourses.length}</p>
          <CourseList
            items={visibleCourses}
            selectedId={selectedId}
            favoriteIds={favoriteIds}
            onSelect={setSelectedId}
            onToggleFavorite={toggle}
          />
        </section>
        <div className="sidebar">
          <SelectedCoursePanel course={selectedCourse} hiddenBySearch={hiddenBySearch} />
          <FavoritesPanel items={favoriteCourses} onClear={clear} />
        </div>
      </div>
    </main>
  );
}
