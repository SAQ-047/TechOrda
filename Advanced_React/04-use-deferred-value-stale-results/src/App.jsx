import { memo, useDeferredValue, useState } from 'react';

const items = Array.from({ length: 240 }, (_, i) => ({
  id: String(i),
  title: ['React', 'CSS', 'TypeScript'][i % 3] + ' ' + i,
}));

function CourseCard({ item, query }) {
  let checksum = item.id.length + query.length;
  for (let i = 0; i < 80000; i++) checksum = (Math.imul(checksum, 31) + i) | 0;
  return <li>{item.title} — {checksum}</li>;
}

const Results = memo(function Results({ query }) {
  const visible = items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <section aria-label="Результаты поиска" data-query={query}>
      <p>Результаты для запроса: «<output id="list-query">{query}</output>»</p>
      <p>Найдено: {visible.length} из {items.length}.</p>
      <ul>{visible.map((item) => <CourseCard key={item.id} item={item} query={query} />)}</ul>
    </section>
  );
});

export default function App() {
  const [mode, setMode] = useState('deferred');
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  const query = mode === 'deferred' ? deferredText : text;
  const isStale = text !== query;

  return (
    <main>
      <h1>04. Отложенное значение и старый результат</h1>
      <p>В обоих режимах: 240 карточек, по 80 000 итераций в каждой показанной карточке.</p>
      <label>Режим обновления
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="normal">Обычный</option>
          <option value="deferred">useDeferredValue</option>
        </select>
      </label>
      <div className="search">
        <label>Поиск
          <input type="search" value={text} onChange={(event) => setText(event.target.value)} />
        </label>
        <button type="button" onClick={() => setText('')}>Очистить</button>
      </div>
      <p>Текущий ввод: «<output id="text-value">{text}</output>»</p>
      <p role="status">{isStale ? 'Обновляем результаты' : 'Результаты актуальны'}</p>
      <p>Подпись над списком относится к показанным карточкам. Пустой запрос показывает все карточки.</p>
      <div aria-busy={isStale}><Results query={query} /></div>
    </main>
  );
}
