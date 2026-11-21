# 07. Контейнер каталога и представление

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/07-course-catalog-container)

`CourseCatalog` хранит поисковый запрос и выбранный ID. При вводе он фильтрует локальный `courses.json` по части названия без учёта регистра и пробелов по краям запроса. Последний выбранный ID виден даже после смены фильтра.

`CourseListView` получает `items`, `emptyText` и `onSelect`. Он строит карточки из переданного массива, подставляет `emptyText` для пустого массива и вызывает `onSelect(id)` при активации карточки. Все данные поступают через props.

Под каталогом `App` показывает два отдельных экземпляра `CourseListView` с полным набором курсов и с `items={[]}`. В полном примере рядом со списком отображается ID, полученный от его callback.

## Запуск

Из папки `Advanced_React`:

```bash
npm ci
npm run dev:07
```

Откройте [http://127.0.0.1:5179/](http://127.0.0.1:5179/). После общей установки из папки задания также работает `npm run dev`.

Сборка и её локальный просмотр из `Advanced_React`:

```bash
npm run build --workspace=07-course-catalog-container
npm run preview:07
```

Адрес собранного приложения [http://127.0.0.1:4179/](http://127.0.0.1:4179/).

## Версии и самопроверка

React и React DOM 19.3.1, Vite 8.3.6, `@vitejs/plugin-react` 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4. Версии закреплены в [package.json](../package.json) и [package-lock.json](../package-lock.json).

`npm ci` и сборка всех семи заданий прошли. В dev и после сборки в Brave проверены следующие сценарии:

1. Изначально в каталоге и полном примере по четыре карточки, а пустой пример показывает «Список курсов пуст.» без карточек.
2. Запрос `  СеРвЕр  ` оставляет в каталоге «Серверный rendering». Enter на карточке передаёт `next`. При запросе без совпадений появляется «Курсы не найдены.», а после очистки возвращаются все курсы.
3. Клик по курсу с нулём мест передаёт `typescript`. Space на карточке в полном примере выводит `testing` в этом примере. Поиск и выбор в каталоге работают независимо от примеров.
4. Приложение работает при отключённом доступе к `localStorage` и `sessionStorage`. Ошибок JavaScript, ошибок загрузки ресурсов и запросов данных через сеть нет.

В решении **111 непустых строк HTML, CSS, JS и JSX**.

## Полный код

Чтобы запустить эти файлы как отдельный проект, сохраните их в одной папке с указанными путями. Выполните `npm install` и `npm run dev` для разработки или `npm run build` и `npm run preview` для просмотра сборки.

### package.json

```json
{
  "name": "techorda-07-course-catalog-container",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5179 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4179 --strictPort"
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
    <title>07. Контейнер каталога и представление · TechOrda</title>
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
import { useState } from 'react';
import CourseCatalog from './CourseCatalog.jsx';
import CourseListView from './CourseListView.jsx';
import courses from './courses.json';

export default function App() {
  const [exampleSelectedId, setExampleSelectedId] = useState(null);

  return (
    <main>
      <h1>Контейнер каталога и представление</h1>
      <CourseCatalog />
      <div className="examples">
        <section aria-labelledby="full-heading">
          <h2 id="full-heading">Представление с полным списком</h2>
          <p role="status">ID из onSelect: {exampleSelectedId ?? '—'}</p>
          <CourseListView items={courses} emptyText="Список курсов пуст." onSelect={setExampleSelectedId} />
        </section>
        <section aria-labelledby="empty-heading">
          <h2 id="empty-heading">Представление с пустым массивом</h2>
          <CourseListView items={[]} emptyText="Список курсов пуст." onSelect={setExampleSelectedId} />
        </section>
      </div>
    </main>
  );
}
```

### src/CourseCatalog.jsx

```jsx
import { useState } from 'react';
import CourseListView from './CourseListView.jsx';
import courses from './courses.json';

export default function CourseCatalog() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const searchText = query.trim().toLowerCase();
  const items = courses.filter(({ title }) => title.toLowerCase().includes(searchText));

  return (
    <section aria-labelledby="catalog-heading">
      <h2 id="catalog-heading">Каталог курсов</h2>
      <label>
        Поиск по названию
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p role="status">Выбранный ID: {selectedId ?? '—'}</p>
      <CourseListView items={items} emptyText="Курсы не найдены." onSelect={setSelectedId} />
    </section>
  );
}
```

### src/CourseListView.jsx

```jsx
export default function CourseListView({ items, emptyText, onSelect }) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul className="course-list">
      {items.map(({ id, title, category, seats }) => (
        <li key={id}>
          <button type="button" onClick={() => onSelect(id)}>
            <strong>{title}</strong>
            <span>{category} · Мест: {seats}</span>
          </button>
        </li>
      ))}
    </ul>
  );
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
section { min-width: 0; padding: 16px; border: 1px solid #68707a; border-radius: 5px; }
.examples { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 16px; }
label { display: flex; flex-direction: column; gap: 4px; max-width: 24rem; }
input, button { min-width: 0; font: inherit; padding: 8px 12px; border: 1px solid #68707a; border-radius: 5px; background: white; color: inherit; }
.course-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.course-list button { display: grid; width: 100%; text-align: left; cursor: pointer; }
.course-list span { font-size: 0.875rem; }
button:hover { background: #e8eef5; }
:is(input, button):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
@media (max-width: 680px) { .examples { grid-template-columns: 1fr; } }
```
