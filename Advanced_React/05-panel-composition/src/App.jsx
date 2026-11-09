import { useState } from 'react';
import Panel from './Panel.jsx';
import courses from './courses.json';

export default function App() {
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const visible = courses.filter((course) => category === 'all' || course.category === category);
  const selectedCourse = courses.find((course) => course.id === selectedId);

  return (
    <main>
      <h1>05. Карточка через композицию</h1>
      <Panel title="Фильтр курсов: выберите направление обучения, чтобы найти подходящую программу">
        <label>Категория
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Все направления</option>
            <option value="frontend">Frontend</option>
            <option value="fullstack">Fullstack</option>
            <option value="quality">Quality</option>
          </select>
        </label>
      </Panel>
      <p role="status">{selectedCourse ? `Выбран курс: ${selectedCourse.title}` : 'Курс ещё не выбран.'}</p>
      {visible.map((course) => (
        <Panel
          key={course.id}
          title={course.title}
          actions={<button type="button" onClick={() => setSelectedId(course.id)}>Выбрать</button>}
        >
          <p>Категория: {course.category}.</p>
          <p>Свободных мест: {course.seats}. Версия: {course.version}.</p>
        </Panel>
      ))}
    </main>
  );
}
