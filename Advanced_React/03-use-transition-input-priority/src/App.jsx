import { memo, useState, useTransition } from 'react';

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
      <p>Запрос готового списка: «<output id="list-query">{query}</output>»</p>
      <p>Найдено: {visible.length} из {items.length}.</p>
      <ul>{visible.map((item) => <CourseCard key={item.id} item={item} query={query} />)}</ul>
    </section>
  );
});

export default function App() {
  const [mode, setMode] = useState('normal');
  const [text, setText] = useState('');
  const [listQuery, setListQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function updateQuery(nextText) {
    setText(nextText);
    if (mode === 'transition') {
      startTransition(() => setListQuery(nextText));
    } else {
      setListQuery(nextText);
    }
  }

  return (
    <main>
      <h1>03. Приоритет ввода через useTransition</h1>
      <p>В обоих режимах: 240 карточек, по 80 000 итераций в каждой показанной карточке.</p>
      <label>Режим обновления
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="normal">Обычный</option>
          <option value="transition">Transition</option>
        </select>
      </label>
      <div className="search">
        <label>Поиск
          <input type="search" value={text} onChange={(event) => updateQuery(event.target.value)} />
        </label>
        <button type="button" onClick={() => updateQuery('')}>Очистить</button>
      </div>
      <p>Срочный text: «<output id="text-value">{text}</output>»</p>
      <p role="status">isPending: {String(isPending)} — {isPending ? 'список обновляется…' : 'список готов.'}</p>
      <p>Пустой запрос показывает все карточки. Transition меняет приоритет обновления списка.</p>
      <div aria-busy={isPending}><Results query={listQuery} /></div>
    </main>
  );
}
