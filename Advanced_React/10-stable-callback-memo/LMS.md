# 10. Стабильный callback и memo

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/10-stable-callback-memo)

`App` хранит общий список выбранных ID и отдельный счётчик. Три панели используют один `memo(CoursePicker)` и показывают одни и те же курсы из `courses.json`. Нажатие кнопки счётчика повторно вызывает `App` и позволяет сравнить пропсы каждой панели.

`memo` по умолчанию сравнивает каждый prop через `Object.is`. `heading` — постоянная строка каждой панели, `items` — ссылка на импортированный массив. `selectedIds` сохраняет ссылку при нажатии счётчика и получает новую при добавлении курса.

| Панель | `onSelect` | `options` | Срабатывания эффекта за нажатие счётчика |
| --- | --- | --- | --- |
| Новый `onSelect` | Новая функция `(id) => selectCourse(id)` | Общий объект из модуля | +1 |
| Стабильные `onSelect` и `options` | `selectCourse` из `useCallback` | Общий объект из модуля | 0 |
| Новый объект `options` | `selectCourse` из `useCallback` | Новый объект `{ ...courseOptions }` | +1 |

Копия в третьей панели сохраняет значение `showSeats`. Новая ссылка меняет prop `options`. При выборе курса меняется `selectedIds`, поэтому все три панели обновляют кнопки. `selectCourse` использует функциональное обновление `setSelectedIds(currentIds => ...)`. React передаёт в него актуальный массив с учётом предыдущих обновлений в очереди. Функция замыкает стабильный setter, поэтому массив зависимостей пустой. Повторный выбор уже добавленного ID возвращает ту же ссылку на массив.

## Запуск

Команды запуска выполняются из папки `Advanced_React`.

```bash
npm ci
npm run dev:10
```

После общей установки из папки задания также работает `npm run dev`. [Открыть локальное приложение](http://127.0.0.1:5182/)

Для локального просмотра сборки выполните эти команды из `Advanced_React`.

```bash
npm run build --workspace=10-stable-callback-memo
npm run preview:10
```

[Открыть собранное приложение](http://127.0.0.1:4182/)

## Версии и самопроверка

React и React DOM 19.3.1, Vite 8.3.6, `@vitejs/plugin-react` 6.3.0. Проверено на Node.js 20.20.2, npm 10.9.4 и Brave 158.1.100.58. [Версии зависимостей](../package.json) · [Lockfile](../package-lock.json)

`npm ci` и сборка всех десяти заданий прошли. В браузере проверены dev с `StrictMode` и production. На каждой панели отображается число запусков `useEffect` после коммита, записанное через ref. Начальное значение равно 2 в dev из-за дополнительного запуска эффекта в `StrictMode` и 1 в production.

- Нажатие счётчика мышью или клавиатурой дало `+1 / 0 / +1` на панелях. В dev временная проверка вызовов функции компонента показала `2 / 0 / 2` на одно нажатие и подтвердила сравнение ссылок.
- Выбор курса дал `+1 / +1 / +1`. Последовательно выбраны `react` и `typescript`. Три клика в одном пакете обновлений добавили `next` и `testing` по одному разу. Список сохранил все четыре ID в порядке выбора.
- Проверены доступность с клавиатуры, ширина 320 px и загрузка ресурсов. Ошибок JavaScript не было.

В файлах решения **115 непустых строк** HTML, CSS, JS и JSX. Унаследованный без изменений `src/main.jsx` в подсчёт не входит.

## Полный код

Для отдельного запуска сохраните файлы с указанными путями в одной папке. Из неё выполните `npm install` и `npm run dev`. Для локального просмотра сборки выполните `npm run build` и `npm run preview`.

### package.json

```json
{
  "name": "techorda-10-stable-callback-memo",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5182 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4182 --strictPort"
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
    <title>10. Стабильный callback и memo · TechOrda</title>
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
import { useCallback, useState } from 'react';
import CoursePicker from './CoursePicker.jsx';
import courses from './courses.json';

const courseOptions = { showSeats: true };

export default function App() {
  const [counter, setCounter] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  const selectCourse = useCallback((id) => {
    setSelectedIds((currentIds) => currentIds.includes(id) ? currentIds : [...currentIds, id]);
  }, []);

  return (
    <main>
      <h1>Стабильный callback и memo</h1>
      <button type="button" onClick={() => setCounter((value) => value + 1)}>
        Увеличить счётчик ({counter})
      </button>
      <p role="status">Выбранные ID: {selectedIds.join(', ') || '—'}</p>
      <div className="comparison">
        <CoursePicker
          heading="Новый onSelect"
          items={courses}
          selectedIds={selectedIds}
          options={courseOptions}
          onSelect={(id) => selectCourse(id)}
        />
        <CoursePicker
          heading="Стабильные onSelect и options"
          items={courses}
          selectedIds={selectedIds}
          options={courseOptions}
          onSelect={selectCourse}
        />
        <CoursePicker
          heading="Новый объект options"
          items={courses}
          selectedIds={selectedIds}
          options={{ ...courseOptions }}
          onSelect={selectCourse}
        />
      </div>
    </main>
  );
}
```

### src/CoursePicker.jsx

```jsx
import { memo, useEffect, useRef } from 'react';

export default memo(function CoursePicker({ heading, items, selectedIds, options, onSelect }) {
  const effectRuns = useRef(0);
  const effectOutput = useRef(null);

  useEffect(() => {
    effectRuns.current += 1;
    effectOutput.current.textContent = String(effectRuns.current);
  });

  return (
    <section aria-label={heading}>
      <h2>{heading}</h2>
      <p>Запуски эффекта после обновления: <span ref={effectOutput} /></p>
      <ul className="course-list" role="list">
        {items.map(({ id, title, seats }) => {
          const isSelected = selectedIds.includes(id);
          return (
            <li key={id}>
              <button type="button" disabled={isSelected} onClick={() => onSelect(id)}>
                {title}
                {options.showSeats && <span>Мест: {seats}</span>}
                {isSelected && <span>Выбран</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
});
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
main { max-width: 1120px; margin: 32px auto; padding: 0 16px; }
h1 { font-size: 1.8rem; }
h2 { margin-top: 0; font-size: 1.25rem; }
button, section { border: 1px solid #68707a; border-radius: 5px; background: white; }
button { font: inherit; padding: 8px 12px; color: inherit; }
button:enabled { cursor: pointer; }
button:enabled:hover { background: #e8eef5; }
button:disabled { background: #e9eaec; }
button:focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
.comparison { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
section { padding: 16px; }
.course-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.course-list button { display: grid; width: 100%; text-align: left; }
.course-list span { font-size: 0.875rem; }
@media (max-width: 760px) { .comparison { grid-template-columns: 1fr; } }
```
