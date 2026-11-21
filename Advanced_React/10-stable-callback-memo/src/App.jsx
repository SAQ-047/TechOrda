import { useCallback, useState } from 'react';
import CoursePicker from './CoursePicker.jsx';
import courses from './courses.json';

const courseOptions = { showSeats: true };

export default function App() {
  const [counter, setCounter] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  const selectCourse = useCallback((id) => {
    setSelectedIds((currentIds) => currentIds.includes(id) ? currentIds : [...currentIds, id]);
  }, []);

  return (
    <main>
      <h1>Стабильный callback и memo</h1>
      <button type="button" onClick={() => setCounter((value) => value + 1)}>
        Увеличить счётчик ({counter})
      </button>
      <p role="status">Выбранные ID: {selectedIds.join(', ') || '—'}</p>
      <div className="comparison">
        <CoursePicker
          heading="Новый onSelect"
          items={courses}
          selectedIds={selectedIds}
          options={courseOptions}
          onSelect={(id) => selectCourse(id)}
        />
        <CoursePicker
          heading="Стабильные onSelect и options"
          items={courses}
          selectedIds={selectedIds}
          options={courseOptions}
          onSelect={selectCourse}
        />
        <CoursePicker
          heading="Новый объект options"
          items={courses}
          selectedIds={selectedIds}
          options={{ ...courseOptions }}
          onSelect={selectCourse}
        />
      </div>
    </main>
  );
}
