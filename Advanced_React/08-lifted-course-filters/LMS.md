# 08. Подъём состояния двух фильтров

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/react-08-lifted-course-filters/Advanced_React/08-lifted-course-filters)

`App` — ближайший общий родитель панели `CourseFilters` и списка `CourseListView`. Он хранит `query` и `category` и передаёт панели текущие значения и обработчики. Кнопка «Сбросить фильтры» очищает строку поиска и выбирает «Все категории».

Каждый курс из `courses.json` должен пройти оба условия. Название содержит запрос без учёта регистра и пробелов по краям, а категория совпадает с выбранной. Вариант «Все категории» пропускает проверку категории. Отфильтрованный массив передаётся списку. Счётчик показывает длину этого же массива, а при нуле карточки сменяются сообщением «Курсы не найдены.».

## Запуск

Из папки `Advanced_React`:

```bash
npm ci
npm run dev:08
```

После общей установки из папки задания также работает `npm run dev`. [Открыть локальное приложение](http://127.0.0.1:5180/)

Сборка и локальный просмотр из `Advanced_React`:

```bash
npm run build --workspace=08-lifted-course-filters
npm run preview:08
```

[Открыть собранное приложение](http://127.0.0.1:4180/)

## Версии и самопроверка

React и React DOM 19.3.1, Vite 8.3.6, `@vitejs/plugin-react` 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4. [Версии зависимостей](../package.json) · [Lockfile](../package-lock.json)

`npm ci` и сборка всех восьми заданий прошли. В Brave в dev и preview проверен счётчик после каждого изменения поиска или категории, а также после сброса.

| Действие | Результат |
| --- | --- |
| Открыть приложение | 4 курса |
| Выбрать `frontend` | 2 курса |
| Ввести `  тИп  ` | 1 курс «Типизация данных» |
| Сменить категорию на `quality`, сохранив запрос | 0 курсов и сообщение «Курсы не найдены.» |
| Заменить запрос на `UI` при `quality` | 1 курс «Проверка поведения UI» |
| Нажать «Сбросить фильтры» | Пустой поиск, «Все категории», 4 курса |

Также проверены `fullstack`, повторный сброс, сброс с клавиатуры и ширина экрана 320 px. Ошибок JavaScript и загрузки ресурсов в браузере не было.

В файлах решения **126 непустых строк** HTML, CSS, JS и JSX. Унаследованный без изменений `src/main.jsx` в подсчёт не входит.

## Полный код

Для отдельного запуска сохраните файлы с указанными путями в одной папке. Из неё выполните `npm install` и `npm run dev`. Для локального просмотра сборки выполните `npm run build` и `npm run preview`.

### package.json

```json
{
  "name": "techorda-08-lifted-course-filters",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5180 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4180 --strictPort"
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
    <title>08. Подъём состояния двух фильтров · TechOrda</title>
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
import CourseFilters from './CourseFilters.jsx';
import CourseListView from './CourseListView.jsx';
import courses from './courses.json';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const searchText = query.trim().toLowerCase();
  const items = courses.filter((course) => {
    const matchesTitle = course.title.toLowerCase().includes(searchText);
    const matchesCategory = category === '' || course.category === category;
    return matchesTitle && matchesCategory;
  });

  function resetFilters() {
    setQuery('');
    setCategory('');
  }

  return (
    <main>
      <h1>Подъём состояния двух фильтров</h1>
      <CourseFilters
        query={query}
        category={category}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onReset={resetFilters}
      />
      <p role="status">Найдено: {items.length}</p>
      <CourseListView items={items} emptyText="Курсы не найдены." />
    </main>
  );
}
```

### src/CourseFilters.jsx

```jsx
export default function CourseFilters({ query, category, onQueryChange, onCategoryChange, onReset }) {
  return (
    <fieldset>
      <legend>Фильтры каталога</legend>
      <div className="filter-fields">
        <label>
          Поиск по названию
          <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <label>
          Категория
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="">Все категории</option>
            <option value="frontend">frontend</option>
            <option value="fullstack">fullstack</option>
            <option value="quality">quality</option>
          </select>
        </label>
        <button type="button" onClick={onReset}>Сбросить фильтры</button>
      </div>
    </fieldset>
  );
}
```

### src/CourseListView.jsx

```jsx
export default function CourseListView({ items, emptyText }) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <ul className="course-list" role="list">
      {items.map(({ id, title, category, seats }) => (
        <li key={id}>
          <strong>{title}</strong>
          <span>{category} · Мест: {seats}</span>
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
fieldset { min-width: 0; margin: 0; padding: 12px 16px 16px; }
fieldset, input, select, button, .course-list li {
  border: 1px solid #68707a;
  border-radius: 5px;
}

.filter-fields {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) auto;
  gap: 12px;
  align-items: end;
}

label { display: grid; gap: 4px; }
input, select, button {
  min-width: 0;
  font: inherit;
  padding: 8px 12px;
  background: white;
  color: inherit;
}

button { cursor: pointer; }
button:hover { background: #e8eef5; }
:is(input, select, button):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
.course-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.course-list li { display: grid; padding: 8px 12px; background: white; }
.course-list span { font-size: 0.875rem; }
@media (max-width: 650px) { .filter-fields { grid-template-columns: 1fr; } }
```
