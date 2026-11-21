# 11. Custom hook избранных курсов

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/11-use-favorites)

`useFavorites` возвращает `ids`, `toggle` и `clear`. `toggle(id)` получает актуальный массив через функциональное обновление `setIds`. Если ID уже есть, `filter` создаёт массив без него. Иначе ID добавляется в новый массив. Повторное нажатие снимает выбор, а `clear()` заменяет массив пустым.

`App` вызывает `useFavorites` один раз. Каталог получает `ids` и `toggle` через props. Панель получает `clear` и список курсов, который `App` вычисляет из тех же `ids`. Панель показывает курсы в порядке каталога. Отметки на кнопках и состав панели всегда выводятся из одного состояния React.

React хранит `useState` отдельно для каждого вызова хука в конкретном экземпляре компонента. Два вызова `useFavorites` выполняют одну и ту же логику с разными массивами. Для общего избранного обе части интерфейса получают результат одного вызова у общего родителя.

## Запуск

Команды запуска выполняются из папки `Advanced_React`.

```bash
npm ci
npm run dev:11
```

После общей установки из папки задания также работает `npm run dev`. [Открыть локальное приложение](http://127.0.0.1:5183/)

Для локального просмотра сборки выполните эти команды из `Advanced_React`.

```bash
npm run build --workspace=11-use-favorites
npm run preview:11
```

[Открыть собранное приложение](http://127.0.0.1:4183/)

## Версии и самопроверка

React и React DOM 19.3.1, Vite 8.3.6, `@vitejs/plugin-react` 6.3.0. Проверено на Node.js 20.20.2, npm 10.9.4 и Brave 158.1.100.58. [Версии зависимостей](../package.json) · [Lockfile](../package-lock.json)

`npm ci` и сборка всех одиннадцати заданий прошли. В браузере проверены dev с `StrictMode` и production.

| Действие | Результат |
| --- | --- |
| Открыть приложение | Панель пуста, все кнопки каталога отжаты |
| Выбрать два курса | Панель показывает два курса, их кнопки нажаты |
| Повторно выбрать один из них | Курс исчезает из панели, его кнопка отжимается |
| Нажать «Очистить избранное» | Панель пуста, все кнопки каталога отжаты |
| Снова добавить курс после очистки | Курс отображается в обеих частях интерфейса в выбранном состоянии |

Проверены переключения и очистка с клавиатуры, быстрые нажатия в одном пакете обновлений и ширина экрана 320 px. В отдельной проверке два вызова хука внутри одного компонента сохранили независимые массивы, а добавление и удаление с замороженными предыдущими массивами прошли успешно.

В файлах решения **110 непустых строк** HTML, CSS, JS и JSX. Унаследованный без изменений `src/main.jsx` в подсчёт не входит.

## Полный код

Для отдельного запуска сохраните файлы с указанными путями в одной папке. Из неё выполните `npm install` и `npm run dev`. Для локального просмотра сборки выполните `npm run build` и `npm run preview`.

### package.json

```json
{
  "name": "techorda-11-use-favorites",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5183 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4183 --strictPort"
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
    <title>11. Custom hook избранных курсов · TechOrda</title>
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
import courses from './courses.json';
import useFavorites from './useFavorites.js';

function CourseList({ items, favoriteIds, onToggle }) {
  return (
    <section aria-labelledby="courses-heading">
      <h2 id="courses-heading">Каталог курсов</h2>
      <ul className="course-list" role="list">
        {items.map(({ id, title, seats }) => {
          const isFavorite = favoriteIds.includes(id);

          return (
            <li key={id}>
              <button type="button" aria-pressed={isFavorite} onClick={() => onToggle(id)}>
                <strong>{title}</strong>
                <span>Мест: {seats}</span>
                <span>Избранное <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span></span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FavoritesPanel({ items, onClear }) {
  const isEmpty = items.length === 0;

  return (
    <section aria-labelledby="favorites-heading">
      <h2 id="favorites-heading">Избранные курсы</h2>
      <button type="button" onClick={onClear} disabled={isEmpty}>Очистить избранное</button>
      {isEmpty ? (
        <p>Избранных курсов пока нет.</p>
      ) : (
        <ul>{items.map(({ id, title }) => <li key={id}>{title}</li>)}</ul>
      )}
    </section>
  );
}

export default function App() {
  const { ids, toggle, clear } = useFavorites();
  const favoriteCourses = courses.filter(({ id }) => ids.includes(id));

  return (
    <main>
      <h1>Каталог и избранное</h1>
      <div className="catalog">
        <CourseList items={courses} favoriteIds={ids} onToggle={toggle} />
        <FavoritesPanel items={favoriteCourses} onClear={clear} />
      </div>
    </main>
  );
}
```

### src/useFavorites.js

```js
import { useState } from 'react';

export default function useFavorites() {
  const [ids, setIds] = useState([]);

  function toggle(id) {
    setIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id);
      }

      return [...currentIds, id];
    });
  }

  function clear() {
    setIds([]);
  }

  return { ids, toggle, clear };
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
button, section { border: 1px solid #68707a; border-radius: 5px; background: white; }
button { font: inherit; padding: 8px 12px; color: inherit; }
button:enabled { cursor: pointer; }
button:enabled:hover { background: #e8eef5; }
button:disabled { color: #68707a; }
button[aria-pressed="true"] { border-color: #185abc; background: #e8eef5; }
button:focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
.catalog { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 16px; }
section { padding: 16px; }
.course-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.course-list button { display: grid; width: 100%; text-align: left; }
.course-list span { font-size: 0.875rem; }
@media (max-width: 650px) { .catalog { grid-template-columns: 1fr; } }
```
