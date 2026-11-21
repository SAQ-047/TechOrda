# 09. Цена useMemo

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/09-use-memo-sort)

Из четырёх записей `courses.json` один раз создаётся каталог из 2000 курсов. Порядковый номер делает каждый `id` уникальным и различает названия. Оба варианта сортируют весь каталог через `toSorted`, который возвращает новую копию. На экране показаны первые пять записей каждого результата.

Оба сравниваемых компонента получают одинаковые `items` и `direction`. Без `useMemo` сортировка выполняется при каждом рендере. С `useMemo` зависимости `[items, direction]` охватывают оба изменяемых входа сортировки. Счётчик хранится отдельно в `App`. При его изменении оба компонента рендерятся, но их входные параметры сохраняются. Смена направления меняет `direction` и обновляет оба результата.

## Запуск

Из папки `Advanced_React`:

```bash
npm ci
npm run dev:09
```

После общей установки из папки задания также работает `npm run dev`. [Открыть локальное приложение](http://127.0.0.1:5181/)

Сборка и локальный просмотр из `Advanced_React`:

```bash
npm run build --workspace=09-use-memo-sort
npm run preview:09
```

[Открыть собранное приложение](http://127.0.0.1:4181/)

## Среда и замеры

EndeavourOS, Linux x86-64, Intel Core i3-7100 3,90 ГГц, Brave 158.1.100.58 в headless-режиме (Chromium 158.0.8127.42). Node.js 20.20.2, npm 10.9.4, React и React DOM 19.3.1, Vite 8.3.6, `@vitejs/plugin-react` 6.3.0. [Версии зависимостей](../package.json) · [Lockfile](../package-lock.json)

Замеры сделаны в production-сборке через Playwright и `performance.now()` вокруг вызова `toSorted` для каталога. Метрика охватывает создание копии и сортировку. После 10 пробных нажатий счётчика и 10 смен направления выполнено по 40 измеряемых действий каждого вида. Направление менялось попеременно.

| Действие | Без `useMemo` | С `useMemo` |
| --- | --- | --- |
| Первое открытие | 1 сортировка | 1 сортировка |
| Нажать счётчик | 40 сортировок · медиана 4,5 мс · диапазон 1,6–11,0 мс | 0 сортировок |
| Сменить направление | 40 сортировок · медиана 4,8 мс · диапазон 1,7–9,2 мс | 40 сортировок · медиана 4,7 мс · диапазон 1,6–8,9 мс |

При обновлении счётчика `useMemo` экономит один вызов сортировки. При смене направления оба варианта сортируют заново, а разброс времени больше разницы между медианами. React сохраняет отсортированный массив из 2000 ссылок и сверяет две зависимости при каждом рендере. Для оценки заметности в интерфейсе понадобился бы замер времени от действия до обновления экрана.

## Самопроверка

`npm ci` и сборка всех девяти заданий прошли. В dev с `StrictMode` и в production проверены 2000 уникальных `id`, порядок всех элементов в обоих направлениях, неизменность содержимого и порядка исходного массива. На экране оба списка совпадают и меняются при выборе направления. По возрастанию первый курс — «Проверка поведения UI 0004», по убыванию — «React-интерфейсы 1997». При обратном переключении снова виден порядок по возрастанию. Проверено изменение счётчика мышью и клавиатурой. В dev с `StrictMode` каждый необходимый вызов сортировки наблюдался дважды.

В файлах решения **103 непустые строки** HTML, CSS, JS и JSX. Унаследованный без изменений `src/main.jsx` в подсчёт не входит.

## Полный код

Для отдельного запуска сохраните файлы с указанными путями в одной папке. Из неё выполните `npm install` и `npm run dev`. Для локального просмотра сборки выполните `npm run build` и `npm run preview`.

### package.json

```json
{
  "name": "techorda-09-use-memo-sort",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5181 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4181 --strictPort"
  },
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  },
  "packageManager": "npm@10.9.4",
  "dependencies": {
    "react": "19.3.1",
    "react-dom": "19.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "6.3.0",
    "vite": "8.3.6"
  }
}
```

### index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>09. Цена useMemo · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
});
```

### src/main.jsx

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### src/App.jsx

```jsx
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
```

### src/catalog.js

```js
import courses from './courses.json';

const collator = new Intl.Collator('ru');

export const catalog = Array.from({ length: 2000 }, (_, index) => {
  const course = courses[index % courses.length];
  const number = String(index + 1).padStart(4, '0');

  return {
    ...course,
    id: `${course.id}-${number}`,
    title: `${course.title} ${number}`,
  };
});

export function sortCourses(items, direction) {
  const order = direction === 'asc' ? 1 : -1;
  return items.toSorted((first, second) => order * collator.compare(first.title, second.title));
}
```

### src/courses.json

```json
[
  {"id":"react","title":"React-интерфейсы","category":"frontend","seats":12,"version":1},
  {"id":"typescript","title":"Типизация данных","category":"frontend","seats":0,"version":1},
  {"id":"next","title":"Серверный rendering","category":"fullstack","seats":8,"version":1},
  {"id":"testing","title":"Проверка поведения UI","category":"quality","seats":5,"version":1}
]
```

### src/styles.css

```css
:root {
  font-family: system-ui, sans-serif;
  color: #202124;
  background: #f6f7f8;
  line-height: 1.6;
}

* { box-sizing: border-box; }
body { margin: 0; }
main { max-width: 900px; margin: 32px auto; padding: 0 16px; }
h1 { font-size: 1.8rem; }
h2 { margin-top: 0; font-size: 1.25rem; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; }
label { display: grid; gap: 4px; }
select, button, section { border: 1px solid #68707a; border-radius: 5px; background: white; }
select, button { font: inherit; padding: 8px 12px; color: inherit; }
button { cursor: pointer; }
button:hover { background: #e8eef5; }
:is(select, button):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
.comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 16px; }
section { padding: 16px; }
ol { margin-bottom: 0; padding-left: 24px; }
@media (max-width: 650px) { .comparison { grid-template-columns: 1fr; } }
```
