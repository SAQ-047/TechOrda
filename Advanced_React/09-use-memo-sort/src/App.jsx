import { useMemo, useState } from 'react';
import { catalog, sortCourses } from './catalog.js';

function SortedPreview({ heading, items }) {
  return (
    <section aria-label={heading}>
      <h2>{heading}</h2>
      <p>Первые 5 из {items.length}</p>
      <ol>
        {items.slice(0, 5).map(({ id, title }) => <li key={id}>{title}</li>)}
      </ol>
    </section>
  );
}

function DirectSort({ items, direction }) {
  const sortedItems = sortCourses(items, direction);
  return <SortedPreview heading="Без useMemo" items={sortedItems} />;
}

function MemoizedSort({ items, direction }) {
  const sortedItems = useMemo(() => sortCourses(items, direction), [items, direction]);
  return <SortedPreview heading="С useMemo" items={sortedItems} />;
}

export default function App() {
  const [direction, setDirection] = useState('asc');
  const [counter, setCounter] = useState(0);

  return (
    <main>
      <h1>Цена useMemo</h1>
      <div className="controls">
        <label>
          Сортировка по названию
          <select value={direction} onChange={(event) => setDirection(event.target.value)}>
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </label>
        <button type="button" onClick={() => setCounter((value) => value + 1)}>
          Увеличить счётчик ({counter})
        </button>
      </div>
      <div className="comparison">
        <DirectSort items={catalog} direction={direction} />
        <MemoizedSort items={catalog} direction={direction} />
      </div>
    </main>
  );
}
