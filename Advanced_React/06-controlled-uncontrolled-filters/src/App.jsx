import { useRef, useState } from 'react';
import courses from './courses.json';

function ControlledFilter({ value, onChange }) {
  return (
    <label>Поиск по названию
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function UncontrolledFilter({ inputRef }) {
  return (
    <label>Поиск по названию
      <input type="search" defaultValue="React" ref={inputRef} />
    </label>
  );
}

function Results({ query }) {
  const visible = courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <p>Применённый запрос: «<output>{query}</output>»</p>
      <p>Найдено: {visible.length} из {courses.length}.</p>
      <ul>{visible.map((course) => <li key={course.id}>{course.title}</li>)}</ul>
    </>
  );
}

export default function App() {
  const [controlledText, setControlledText] = useState('React');
  const [appliedQuery, setAppliedQuery] = useState('React');
  const uncontrolledRef = useRef(null);

  function resetUncontrolled() {
    uncontrolledRef.current.value = '';
    setAppliedQuery('');
  }

  return (
    <main>
      <h1>06. Управляемый и неуправляемый фильтр</h1>
      <p>Начальное значение обоих полей — React. Внешние кнопки сброса очищают запрос и возвращают все курсы.</p>
      <div className="filters">
        <section aria-labelledby="controlled-heading">
          <h2 id="controlled-heading">Управляемый фильтр</h2>
          <p>Значение хранится в React state. Список обновляется при вводе.</p>
          <ControlledFilter value={controlledText} onChange={setControlledText} />
          <div className="actions">
            <button type="button" onClick={() => setControlledText('')}>Сбросить управляемый</button>
          </div>
          <Results query={controlledText} />
        </section>
        <section aria-labelledby="uncontrolled-heading">
          <h2 id="uncontrolled-heading">Неуправляемый фильтр</h2>
          <p>Текущий ввод хранится в DOM. Список обновляется по кнопке «Применить».</p>
          <UncontrolledFilter inputRef={uncontrolledRef} />
          <div className="actions">
            <button type="button" onClick={() => setAppliedQuery(uncontrolledRef.current.value)}>Применить</button>
            <button type="button" onClick={resetUncontrolled}>Сбросить неуправляемый</button>
          </div>
          <Results query={appliedQuery} />
        </section>
      </div>
    </main>
  );
}
