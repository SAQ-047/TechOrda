# 02. Чистота render и выбор курса

Исправлен кейс `render-side-effect`: запись `localStorage.setItem('selected-course', course.id)` удалена из тела карточки. Теперь она выполняется в `handleSelect`, который вызывается только кнопкой «Выбрать». Использованы четыре вымышленных курса из условия.

## Как работает решение

`CourseCard` вычисляет JSX из props. В `onClick` передаётся функция `() => onSelect(course.id)`, поэтому обработчик не вызывается во время render. После клика родитель сохраняет id выбранной карточки в `selected-course` и обновляет React state для подтверждения на странице.

До клика приложение не пишет, не удаляет и не очищает localStorage. Если выбор уже был сохранён, отображение карточек его не перезаписывает. «Повторить render» обновляет только счётчик родителя; повторное вычисление карточек не сохраняет курс заново. Дополнительные render в StrictMode также не меняют хранилище. Каждый клик, в том числе повторный выбор того же курса, выполняет одну запись.

Выбор курса с `seats: 0` разрешён: ограничения по местам в этом задании нет. Сообщение на странице отражает последний клик после её открытия. При перезагрузке сообщение сбрасывается, сохранённый id остаётся в localStorage.

## Почему перенос в Effect без клика не подходит

`useEffect(() => localStorage.setItem('selected-course', course.id), [course.id])` запускает запись после начального commit без нажатия кнопки и снова при изменении id. Вариант с `[]` тоже записывает данные после монтажа без выбора пользователя. Перенос из render в Effect меняет время выполнения, но не связывает запись с действием пользователя. Поэтому для этого требования запись находится непосредственно в обработчике клика. Подробнее: [React: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects).

## Версии и запуск

React / React DOM 19.3.1, Vite 8.3.6, @vitejs/plugin-react 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4. Требование Vite к Node.js: `^20.19.0 || >=22.12.0`.

Сохраните общий `package.json` в корне `Advanced_React`, файлы задания — в подпапке `02-render-purity` по указанным ниже путям. При создании проекта из текста выполните из `Advanced_React`:

```bash
npm install
npm run dev:02
```

Адрес приложения: `http://127.0.0.1:5174/`. В исходном проекте сохранён общий `Advanced_React/package-lock.json`; для установки из него используйте `npm ci`. Все задания используют один корневой `node_modules`. Общий lockfile можно приложить к ответу отдельным файлом.

Проверка production:

```bash
npm run build --workspace=02-render-purity
npm run preview:02
```

Адрес preview: `http://127.0.0.1:4174/`. Разные порты означают разные origin и отдельные localStorage.

## Самопроверка

Установка по lockfile и production-сборка прошли. Браузерная проверка через Playwright Core и Brave прошла в четырёх сценариях: dev + StrictMode и production, каждый с отсутствующим ключом и с ранее сохранённым значением. Вызовы методов изменения Storage перехватывались до загрузки приложения, чтобы обнаруживать даже повторную запись того же id.

В каждом сценарии:

- До первого клика нет изменений localStorage; первоначальное значение сохранено.
- Выбраны все четыре курса и повторно тот же курс: пять кликов дали ровно пять записей правильных id.
- Восемь проверочных render не добавили записей.
- Перезагрузка сохранила выбранный id; монтаж и render после неё не записали данные.
- Посторонние ключи не изменились. Ошибок JavaScript и загрузки ресурсов нет. При ширине экрана 360 px горизонтальной прокрутки нет.

Для ручной проверки откройте DevTools → Application → Local Storage → `http://127.0.0.1:5174`. Перезагрузите страницу, повторите render, выберите курс и снова повторите render. Прочитать сохранённое значение можно в Console:

```js
localStorage.getItem('selected-course');
```

Собственный HTML/CSS/JS/JSX: **86 непустых строк**. Это позволяет отправить решение прямо в LMS без обязательных ссылок на GitHub и GitHub Pages.

## Полный код

### package.json

```json
{
  "name": "techorda-advanced-react",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  },
  "packageManager": "npm@10.9.4",
  "workspaces": [
    "[0-9][0-9]-*"
  ],
  "scripts": {
    "dev:01": "npm run dev --workspace=01-render-commit",
    "dev:02": "npm run dev --workspace=02-render-purity",
    "dev:03": "npm run dev --workspace=03-input-transition",
    "dev:04": "npm run dev --workspace=04-deferred-results",
    "build": "npm run build --workspaces",
    "preview:01": "npm run preview --workspace=01-render-commit",
    "preview:02": "npm run preview --workspace=02-render-purity",
    "preview:03": "npm run preview --workspace=03-input-transition",
    "preview:04": "npm run preview --workspace=04-deferred-results"
  },
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

### 02-render-purity/package.json

```json
{
  "name": "techorda-02-render-purity",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5174 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4174 --strictPort"
  }
}
```

### 02-render-purity/index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>02. Чистота render и выбор курса · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 02-render-purity/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../node_modules/.vite/02-render-purity',
  base: './',
});
```

### 02-render-purity/src/main.jsx

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

### 02-render-purity/src/courses.json

```json
[
  {"id":"react","title":"React-интерфейсы","category":"frontend","seats":12,"version":1},
  {"id":"typescript","title":"Типизация данных","category":"frontend","seats":0,"version":1},
  {"id":"next","title":"Серверный rendering","category":"fullstack","seats":8,"version":1},
  {"id":"testing","title":"Проверка поведения UI","category":"quality","seats":5,"version":1}
]
```

### 02-render-purity/src/App.jsx

```jsx
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
```

### 02-render-purity/src/styles.css

```css
:root {
  font-family: system-ui, sans-serif;
  color: #202124;
  background: #f6f7f8;
  line-height: 1.6;
}

body { margin: 0; }
main { max-width: 760px; margin: 40px auto; padding: 0 20px; }
h1 { font-size: 1.8rem; }
h2 { margin-top: 0; font-size: 1.25rem; }
button {
  font: inherit;
  padding: 8px 14px;
  border: 1px solid #68707a;
  border-radius: 5px;
  background: white;
  color: inherit;
  cursor: pointer;
}
button:hover { background: #e8eef5; }
button:focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
article { margin: 20px 0; padding: 20px; border: 1px solid #68707a; border-radius: 5px; }
```

## Источники

- [React: Keeping Components Pure](https://react.dev/learn/keeping-components-pure).
- [React: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects).
