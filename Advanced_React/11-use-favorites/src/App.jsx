import courses from './courses.json';
import useFavorites from './useFavorites.js';

function CourseList({ items, favoriteIds, onToggle }) {
  return (
    <section aria-labelledby="courses-heading">
      <h2 id="courses-heading">Каталог курсов</h2>
      <ul className="course-list" role="list">
        {items.map(({ id, title, seats }) => {
          const isFavorite = favoriteIds.includes(id);

          return (
            <li key={id}>
              <button type="button" aria-pressed={isFavorite} onClick={() => onToggle(id)}>
                <strong>{title}</strong>
                <span>Мест: {seats}</span>
                <span>Избранное <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span></span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FavoritesPanel({ items, onClear }) {
  const isEmpty = items.length === 0;

  return (
    <section aria-labelledby="favorites-heading">
      <h2 id="favorites-heading">Избранные курсы</h2>
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
  const { ids, toggle, clear } = useFavorites();
  const favoriteCourses = courses.filter(({ id }) => ids.includes(id));

  return (
    <main>
      <h1>Каталог и избранное</h1>
      <div className="catalog">
        <CourseList items={courses} favoriteIds={ids} onToggle={toggle} />
        <FavoritesPanel items={favoriteCourses} onClear={clear} />
      </div>
    </main>
  );
}
