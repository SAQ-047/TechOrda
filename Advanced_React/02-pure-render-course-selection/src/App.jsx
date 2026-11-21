import { useState } from 'react';
import courses from './courses.json';

function CourseCard({ course, onSelect }) {
  return (
    <article aria-labelledby={`course-${course.id}`}>
      <h2 id={`course-${course.id}`}>{course.title}</h2>
      <p>Категория: {course.category}. Мест: {course.seats}.</p>
      <button type="button" onClick={() => onSelect(course.id)}>Выбрать</button>
    </article>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [updates, setUpdates] = useState(0);

  function handleSelect(id) {
    localStorage.setItem('selected-course', id);
    setSelectedId(id);
  }

  return (
    <main>
      <h1>02. Чистота render и выбор курса</h1>
      <p>Карточки сохраняют id в localStorage только по нажатию «Выбрать».</p>
      <button type="button" onClick={() => setUpdates((value) => value + 1)}>
        Повторить render
      </button>
      <p>Проверочные обновления родителя: <output>{updates}</output></p>
      <p role="status">
        {selectedId ? `Выбранный id: ${selectedId}` : 'Выберите курс кнопкой «Выбрать».'}
      </p>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onSelect={handleSelect} />
      ))}
    </main>
  );
}
