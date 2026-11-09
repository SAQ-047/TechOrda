# 04. Отложенное значение и старый результат

Сохранена лаборатория из условия: 240 вымышленных элементов React / CSS / TypeScript. В каждой отображаемой CourseCard остался цикл на 80 000 итераций, Results обёрнут в memo. В отдельной версии доступны обычный режим и useDeferredValue; по умолчанию включён useDeferredValue.

## Решение

Вместо двух независимых поисковых состояний используется одно состояние text и отложенная версия useDeferredValue(text). Input получает value={text} и обновляет text срочно. Отдельных setListQuery, startTransition, Effect и таймеров нет.

В deferred-режиме query равен deferredText, в обычном — text. В список передаётся только query: свежий text, флаг устаревания, объекты и callbacks дополнительными props не передаются. Поэтому прежний строковый query сохраняет границу memo при срочном обновлении ввода. Хук вызывается безусловно, а обычный режим не использует его отложенный результат.

Подпись «Результаты для запроса» находится внутри Results и вычисляется из того же query, что фильтрация и карточки. При отставании старый список сохраняет старую подпись. Снаружи условие text !== query выводит «Обновляем результаты» и задаёт aria-busy. Когда список догоняет ввод, показано «Результаты актуальны».

Очистка вызывает setText(''); отложенный список некоторое время может сохранять предыдущий запрос с правильной подписью. После завершения запроса показаны пустая строка и все 240 карточек.

## Отличие от debounce и ограничение цикла

Типичный debounce ждёт заданную паузу после последнего ввода, перезапуская таймер при новых событиях. useDeferredValue не задаёт такую паузу: React пытается обновить отложенную часть после срочной работы и может прервать фоновый render при новом вводе. Фиксированной задержки или гарантированного ускорения нет.

React может уступить выполнение между компонентами, но не посередине уже выполняющегося синхронного JavaScript-цикла. Один монолитный дорогой цикл продолжит блокировать главный поток, включая ввод. Поэтому нагрузка сохранена в отдельных карточках. Для одного длинного расчёта нужны разбиение работы на порции или Web Worker; сам хук параллельного потока не создаёт.

## Версии и запуск

React / React DOM 19.3.1, Vite 8.3.6, @vitejs/plugin-react 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4.

Корневой package.json сохраните в Advanced_React, остальные файлы — по путям ниже. При создании проекта из текста выполните из Advanced_React:

```bash
npm install
npm run dev:04
```

В полном репозитории сохранён один Advanced_React/package-lock.json; установка из него — npm ci. Все задания используют один Advanced_React/node_modules. Dev: http://127.0.0.1:5176/.

Production:

```bash
npm run build --workspace=04-deferred-results
npm run preview:04
```

Preview: http://127.0.0.1:4176/. Для ручного наблюдения выберите замедление CPU в DevTools, введите React, дождитесь списка, затем замените ввод на CSS. Сравните текущий ввод, подпись списка и индикатор. Повторите опыт с очисткой и в обычном режиме при тех же настройках.

## Результат самопроверки

Установка по общему lockfile и сборка всех четырёх workspaces прошли. Браузерная проверка через Playwright Core и Brave прошла в dev + StrictMode и production; промежуточные состояния наблюдались при замедлении CPU ×6.

В обоих случаях получена последовательность:

| Текущий ввод | Подпись списка | Карточки | Статус |
| --- | --- | --- | --- |
| React | React | 80 React | Результаты актуальны |
| CSS | React | Прежние 80 React | Обновляем результаты |
| CSS | CSS | 80 CSS | Результаты актуальны |

Каждое наблюдаемое DOM-состояние проверено: все карточки соответствуют запросу своей подписи, индикатор включён ровно при несовпадении значений. Во время отставания первая старая карточка сохраняет идентичность. В обычном режиме промежуточного отставания не зафиксировано.

Дополнительно прошли:

- Оба режима: React, CSS, TypeScript, разный регистр, частичный запрос, отсутствие совпадений, пустая строка — правильные элементы и порядок.
- Быстрый ввод с последним запросом React 23 — три карточки.
- Очистка через input и кнопку — пустой запрос, 240 карточек.
- Очистка во время отставания: после CSS → TypeScript нажатие «Очистить» сначала даёт пустой текущий ввод со старым списком CSS и корректной подписью; затем показаны все 240 элементов. Устаревший запрос не возвращается.
- Ошибок JavaScript и загрузки ресурсов нет; на экране шириной 360 px горизонтальной прокрутки нет.

Собственный HTML/CSS/JS/JSX — **97 непустых строк**. Решение можно отправить прямо в LMS без обязательной публикации GitHub Pages. Проверяемый шаг в локальном репозитории TechOrda отмечен тегом react-04; SHA: git rev-parse react-04.

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
    "dev:05": "npm run dev --workspace=05-panel-composition",
    "dev:06": "npm run dev --workspace=06-controlled-uncontrolled",
    "build": "npm run build --workspaces",
    "preview:01": "npm run preview --workspace=01-render-commit",
    "preview:02": "npm run preview --workspace=02-render-purity",
    "preview:03": "npm run preview --workspace=03-input-transition",
    "preview:04": "npm run preview --workspace=04-deferred-results",
    "preview:05": "npm run preview --workspace=05-panel-composition",
    "preview:06": "npm run preview --workspace=06-controlled-uncontrolled"
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

### 04-deferred-results/package.json

```json
{
  "name": "techorda-04-deferred-results",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5176 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4176 --strictPort"
  }
}
```

### 04-deferred-results/index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>04. Отложенное значение и старый результат · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 04-deferred-results/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../node_modules/.vite/04-deferred-results',
  base: './',
});
```

### 04-deferred-results/src/main.jsx

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

### 04-deferred-results/src/App.jsx

```jsx
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
```

### 04-deferred-results/src/styles.css

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
label { display: flex; flex-direction: column; gap: 4px; }
.search { display: flex; align-items: end; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
input, select, button { font: inherit; padding: 8px 12px; border: 1px solid #68707a; border-radius: 5px; }
input { box-sizing: border-box; max-width: 100%; }
select, button { background: white; color: inherit; }
button { cursor: pointer; }
button:hover { background: #e8eef5; }
:is(input, select, button):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
section { border-top: 1px solid #68707a; }
[aria-busy="true"] ul { opacity: 0.6; }
```

## Источник

[React: useDeferredValue](https://react.dev/reference/react/useDeferredValue).
