# 03. Приоритет ввода через useTransition

Взята лаборатория поиска из условия: 240 вымышленных элементов `React / CSS / TypeScript`. В каждой отображаемой `CourseCard` сохранён цикл из 80 000 итераций, результат checksum выводится в DOM. `Results` обёрнут в `memo`; в обоих режимах используются те же данные, карточки и фильтрация.

## Реализация

Состояния независимы: `text` управляет input, `listQuery` передаётся в дорогой список. Обработчик всегда вызывает `setText(nextText)` срочно. В режиме «Обычный» `setListQuery(nextText)` вызывается рядом; в режиме «Transition» только этот setter обёрнут в `startTransition`.

При срочном обновлении `text` prop `query` у `memo(Results)` остаётся прежним, поэтому список может пропустить вычисление. В transition-обновлении React вычисляет новые карточки и может уступать выполнение между компонентами для обработки ввода. Синхронный цикл отдельной карточки не переносится в другой поток и не прерывается посередине.

Показаны срочный `text`, `isPending` и запрос уже завершённого списка. Во время pending на экране могут оставаться прежние результаты. «Очистить» и изменение input используют один обработчик с конкретным `nextText`, включая пустую строку. Callback transition не читает позднее событие или прежний `text`. После завершения последнего обновления список соответствует последнему вводу; пустой запрос возвращает все 240 карточек.

## Сравнение и наблюдения

Сравнение выполнено в production-preview, headless Brave 152.0.7977.83, при одинаковом замедлении CPU ×6. После прогрева `CSS → очистить` трижды вводилось `React` без намеренной задержки между клавишами, по 15 событий input на режим. Между попытками ожидался полный сброс списка до 240 элементов.

| Наблюдение | Обычный режим | Transition |
| --- | --- | --- |
| Медиана от события input до фиксации React text в DOM | 45,3 мс | 1,9 мс |
| Наблюдался isPending: true | Нет | Да |
| Промежуточные состояния: новый text при старом запросе списка | 0 | 15 |
| Итог | React, 80 карточек | React, 80 карточек |

Измерение заканчивается уведомлением MutationObserver об обновлении React text в DOM. Это не задержка до показа кадра и не полное время вычисления списка. В обычном режиме text и список фиксировались вместе; в transition-режиме сначала фиксировался срочный text, затем список.

Эти числа описывают один локальный опыт. Фиксированного ускорения нет: transition меняет приоритет, сохраняя нагрузку карточек; прерванная работа может повторяться. На быстром устройстве pending может быть кратким. Dev-режим с корневым StrictMode дополнительно вызывает компоненты, поэтому сравнение режимов выполнено в одной production-сборке.

## Версии и команды

React / React DOM 19.3.1, Vite 8.3.6, @vitejs/plugin-react 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4.

Корневой `package.json` сохраните в `Advanced_React`, остальные файлы — по путям ниже. При создании проекта из текста выполните из `Advanced_React`:

```bash
npm install
npm run dev:03
```

В полном репозитории используется один сохранённый `Advanced_React/package-lock.json`; установка из него — `npm ci`. Все задания используют общий `Advanced_React/node_modules`. Dev: `http://127.0.0.1:5175/`.

Production:

```bash
npm run build --workspace=03-input-transition
npm run preview:03
```

Preview: `http://127.0.0.1:4175/`. Для ручного сравнения выберите одинаковое замедление CPU в DevTools и повторите `очистить → быстро набрать React → дождаться списка → очистить` в обоих режимах.

## Результат самопроверки

- `npm ci` и сборка всех трёх workspaces прошли.
- В dev + StrictMode и production проверены оба режима: React, CSS, TypeScript, разный регистр, частичный запрос, отсутствие совпадений и пустая строка. DOM содержит правильные элементы в исходном порядке.
- После быстрого ввода последним отображается `React 23`: три карточки.
- Очистка кнопкой и через input возвращает пустой запрос и все 240 карточек.
- Очистка во время `isPending: true` проверена в обеих сборках: прежний непустой запрос после завершения не возвращается.
- Ошибок JavaScript и загрузки ресурсов нет. На экране шириной 360 px горизонтальной прокрутки нет.

Собственный HTML/CSS/JS/JSX — **104 непустых строки**. Код можно отправить прямо в LMS без обязательной публикации GitHub Pages. Проверяемый шаг в локальном репозитории `TechOrda` отмечен тегом `react-03`; SHA коммита: `git rev-parse react-03`.

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

### 03-input-transition/package.json

```json
{
  "name": "techorda-03-input-transition",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5175 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4175 --strictPort"
  }
}
```

### 03-input-transition/index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>03. Приоритет ввода через useTransition · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 03-input-transition/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../node_modules/.vite/03-input-transition',
  base: './',
});
```

### 03-input-transition/src/main.jsx

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

### 03-input-transition/src/App.jsx

```jsx
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
```

### 03-input-transition/src/styles.css

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

## Источники

- [React: useTransition](https://react.dev/reference/react/useTransition).
- [React: memo](https://react.dev/reference/react/memo).
