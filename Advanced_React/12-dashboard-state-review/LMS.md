# 12. Review состояния небольшого dashboard

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/react-12-dashboard-state-review/Advanced_React/12-dashboard-state-review)

## Владельцы состояния

`App` владеет строкой поиска `query` и идентификатором `selectedId`. Один вызов `useFavorites` в `App` хранит `favoriteIds`. Эти три значения отражают самостоятельные действия пользователя и обслуживают несколько частей интерфейса. `courses.json` содержит исходный каталог.

```text
courses.json · полный каталог
└─ App · state: query, selectedId, favoriteIds (через useFavorites)
   ├─ Каталог · запрос, результаты, отметки выбора и избранного
   ├─ Выбранный курс · запись из полного каталога и признак скрытия
   └─ Избранное · записи из полного каталога
```

`App` вычисляет `visibleCourses` по запросу, `selectedCourse` по `selectedId` и `favoriteCourses` по `favoriteIds`. Оба счётчика читают длину соответствующего списка. Признак `hiddenBySearch` вычисляется по наличию выбранного курса в результатах.

Выбранная карточка использует полный каталог и остаётся в отдельной панели, даже когда в результатах ноль курсов. В таком случае панель сообщает «Выбранный курс вне результатов текущего поиска». «Очистить поиск» меняет только `query`. «Очистить избранное» очищает только `favoriteIds`. Выбор курса меняется при нажатии на карточку в каталоге.

## Два отклонённых варианта

1. **Хранить производные данные в state.** Отдельные копии результатов, числа совпадений и объекта курса пришлось бы обновлять вместе с запросом, ID и каталогом. Например, пропущенное обновление счётчика показало бы старое число рядом с новым списком. Вычисление в рендере даёт значения из одного снимка исходных данных.
2. **Хранить выбор и избранное отдельно внутри панелей.** Если каталог и избранное вызывают `useFavorites` по отдельности, отметка в каталоге и список панели обновляются независимо. Если ID выбора живёт внутри карточки каталога, скрытие карточки размонтирует владельца выбора. Один общий владелец в `App` сохраняет значения при фильтрации и передаёт обеим панелям согласованные данные.

## Запуск

Команды запуска выполняются из папки `Advanced_React`.

```bash
npm ci
npm run dev:12
```

После общей установки из папки задания также работает `npm run dev`. [Открыть локальное приложение](http://127.0.0.1:5184/)

Для локального просмотра сборки выполните эти команды из `Advanced_React`.

```bash
npm run build --workspace=12-dashboard-state-review
npm run preview:12
```

[Открыть собранное приложение](http://127.0.0.1:4184/)

## Версии и самопроверка

React и React DOM 19.3.1, Vite 8.3.6, `@vitejs/plugin-react` 6.3.0. Проверено на Node.js 20.20.2, npm 10.9.4 и Brave 158.1.100.58. [Версии зависимостей](../package.json) · [Lockfile](../package-lock.json)

`npm ci` и сборка всех двенадцати заданий прошли. В браузере проверены dev с `StrictMode` и production.

| Действие | Результат |
| --- | --- |
| Выбрать React и добавить React и TypeScript в избранное | Выбран React, в избранном два курса |
| Ввести `  сЕРВЕР  ` | Один результат, карточка React остаётся в отдельной панели с пояснением, избранное содержит два курса |
| Очистить избранное при активном запросе | Избранное пусто, запрос и выбор React сохраняются |
| Добавить серверный курс в избранное и ввести запрос без совпадений | Ноль результатов, карточка React и серверный курс в избранном видны |
| Очистить поиск | Возвращаются четыре курса, React отмечен как выбранный, избранное сохраняется |
| Выбрать TypeScript и дважды переключить его избранное | Выбран TypeScript с нулём мест, число в избранном сначала растёт, затем возвращается к прежнему значению |

Также проверены клавиатура, ширина 320 px, ошибки JavaScript и загрузка ресурсов. Счётчики соответствовали спискам, данные курсов загрузились из локального модуля.

В файлах решения **169 непустых строк** HTML, CSS, JS и JSX, включая `useFavorites` из задания 11. Унаследованный без изменений `src/main.jsx` в подсчёт не входит.

## Полный код

Для отдельного запуска сохраните файлы с указанными путями в одной папке. Из неё выполните `npm install` и `npm run dev`. Для локального просмотра сборки выполните `npm run build` и `npm run preview`.

### package.json

```json
{
  "name": "techorda-12-dashboard-state-review",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5184 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4184 --strictPort"
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
    <title>12. Review состояния небольшого dashboard · TechOrda</title>
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
import CourseList from './CourseList.jsx';
import courses from './courses.json';
import useFavorites from './useFavorites.js';

function SelectedCoursePanel({ course, hiddenBySearch }) {
  return (
    <section aria-labelledby="selected-heading">
      <h2 id="selected-heading">Выбранный курс</h2>
      {course ? (
        <>
          <h3>{course.title}</h3>
          <p>{course.category} · Мест: {course.seats}</p>
          {hiddenBySearch && <p>Выбранный курс вне результатов текущего поиска.</p>}
        </>
      ) : <p>Курс ещё не выбран.</p>}
    </section>
  );
}

function FavoritesPanel({ items, onClear }) {
  const isEmpty = items.length === 0;

  return (
    <section aria-labelledby="favorites-heading">
      <h2 id="favorites-heading">Избранное ({items.length})</h2>
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
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { ids: favoriteIds, toggle, clear } = useFavorites();

  const searchText = query.trim().toLowerCase();
  const visibleCourses = courses.filter(({ title }) => title.toLowerCase().includes(searchText));
  const selectedCourse = courses.find(({ id }) => id === selectedId);
  const favoriteCourses = courses.filter(({ id }) => favoriteIds.includes(id));
  const hiddenBySearch = Boolean(selectedCourse) && !visibleCourses.some(({ id }) => id === selectedId);

  return (
    <main>
      <h1>Обзор каталога курсов</h1>
      <div className="dashboard">
        <section aria-labelledby="catalog-heading">
          <h2 id="catalog-heading">Каталог</h2>
          <div className="search">
            <label>
              Поиск по названию
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <button type="button" onClick={() => setQuery('')} disabled={query === ''}>Очистить поиск</button>
          </div>
          <p role="status">Найдено: {visibleCourses.length}</p>
          <CourseList
            items={visibleCourses}
            selectedId={selectedId}
            favoriteIds={favoriteIds}
            onSelect={setSelectedId}
            onToggleFavorite={toggle}
          />
        </section>
        <div className="sidebar">
          <SelectedCoursePanel course={selectedCourse} hiddenBySearch={hiddenBySearch} />
          <FavoritesPanel items={favoriteCourses} onClear={clear} />
        </div>
      </div>
    </main>
  );
}
```

### src/CourseList.jsx

```jsx
export default function CourseList({ items, selectedId, favoriteIds, onSelect, onToggleFavorite }) {
  if (items.length === 0) {
    return <p>Курсы не найдены.</p>;
  }

  return (
    <ul className="course-list" role="list">
      {items.map(({ id, title, category, seats }) => {
        const isFavorite = favoriteIds.includes(id);

        return (
          <li key={id}>
            <button
              type="button"
              className="course-choice"
              aria-current={id === selectedId ? 'true' : undefined}
              onClick={() => onSelect(id)}
            >
              <strong>{title}</strong>
              <span>{category} · Мест: {seats}</span>
            </button>
            <button
              type="button"
              aria-label={`Избранное: ${title}`}
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(id)}
            >
              Избранное <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
            </button>
          </li>
        );
      })}
    </ul>
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
main { max-width: 1000px; margin: 32px auto; padding: 0 16px; }
h1 { font-size: 1.8rem; }
h2 { margin-top: 0; font-size: 1.25rem; }
h3 { font-size: 1rem; }
button, input, section { border: 1px solid #68707a; border-radius: 5px; background: white; }
button, input { min-width: 0; font: inherit; padding: 8px 12px; color: inherit; }
button:enabled { cursor: pointer; }
button:enabled:hover { background: #e8eef5; }
button:disabled { color: #68707a; }
button:is([aria-current="true"], [aria-pressed="true"]) { border-color: #185abc; background: #e8eef5; }
:is(button, input):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
.dashboard { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 16px; align-items: start; }
.sidebar, .course-list { display: grid; gap: 12px; }
section { padding: 16px; }
.search { display: flex; flex-wrap: wrap; gap: 8px; align-items: end; }
.search label { display: grid; gap: 4px; flex: 1 1 12rem; min-width: 0; }
.course-list { margin: 0; padding: 0; list-style: none; }
.course-list li { display: flex; flex-wrap: wrap; gap: 8px; }
.course-choice { display: grid; text-align: left; flex: 1 1 13rem; }
.course-choice span { font-size: 0.875rem; }
@media (max-width: 700px) { .dashboard { grid-template-columns: 1fr; } }
```
