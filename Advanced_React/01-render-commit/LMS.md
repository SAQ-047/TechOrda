# 01. Render и commit на счётчике

Реализован родитель со счётчиком и обычный дочерний компонент без `memo`. Ребёнок выводит изменяемый `title` и постоянный текст. Для повторного монтажа меняется `key`.

## Объяснение результата

1. При увеличении счётчика функция `Child` вызывается и выводит `[render]`, хотя её props прежние. React сравнивает вычисленный JSX с предыдущим результатом. Счётчик в DOM родителя меняется; в DOM ребёнка изменений нет, поэтому `[DOM]` отсутствует.
2. При изменении `title` происходит render, а затем React меняет текст заголовка в commit. `MutationObserver` фиксирует мутацию `characterData`; постоянный абзац и существующие элементы сохраняются.
3. Лог в теле компонента означает вычисление компонента, а не изменение DOM. Observer сообщает о реальных мутациях асинхронно и только внутри наблюдаемого поддерева. Он не является счётчиком commit и не видит первоначальное создание DOM: подписка подключается после него, в эффекте.
4. Эффект с `[]` создаёт подписку при монтаже и возвращает cleanup с `disconnect()`. Обычные обновления не создают новых подписок. При смене `key` старый observer отключается, а новый экземпляр ребёнка получает новый observer. Удаление самого наблюдаемого узла его observer не фиксирует.
5. В dev-режиме корневой `StrictMode` дополнительно вызывает render и проверяет эффект циклом `setup → cleanup → setup`. Поэтому повторные логи ожидаемы. В каждый момент активна максимум одна подписка, после монтажа — ровно одна. В production дополнительных проверок StrictMode нет. Диагностический счётчик подписок изменяется только в эффекте и его cleanup.

## Версии и запуск

React / React DOM 19.3.1, Vite 8.3.6, @vitejs/plugin-react 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4. Требование Vite к Node.js: `^20.19.0 || >=22.12.0`.

Сохраните общий `package.json` в корне `Advanced_React`, файлы задания — в подпапке `01-render-commit` по указанным ниже путям. При создании проекта из этого текста выполните из `Advanced_React`:

```bash
npm install
npm run dev:01
```

В исходном проекте сохранён общий `Advanced_React/package-lock.json`; для установки из него используйте `npm ci` вместо `npm install`. Все задания используют один корневой `node_modules`. При необходимости общий lockfile можно приложить к ответу отдельным файлом.

Откройте адрес из терминала и DevTools → Console. После полного обновления страницы по очереди увеличьте счётчик, измените `title`, несколько раз перемонтируйте ребёнка и снова измените `title`. Сравните сообщения `[render]`, `[DOM]` и `[observer]`.

Проверка production:

```bash
npm run build --workspace=01-render-commit
npm run preview:01
```

## Результат самопроверки

Установка по lockfile и production-сборка прошли. Браузерная проверка через Playwright Core и Brave прошла в обоих режимах:

- Три увеличения счётчика: значение 3, DOM ребёнка прежний, уведомлений о его мутациях нет. В dev получено шесть вызовов ребёнка, в production — три.
- Изменение `title`: одна мутация текста заголовка, постоянный абзац не меняется; элементы сохраняют идентичность.
- Три перемонтирования: старый узел удалён, максимум одна активная подписка. Ручное изменение сохранённого старого узла не вызывает уведомлений.
- Изменение `title` после перемонтирований: одно уведомление, активна одна подписка.
- Ошибок JavaScript и загрузки ресурсов нет. При ширине экрана 360 px горизонтальной прокрутки нет.

Собственный HTML/CSS/JS/JSX: **110 непустых строк**. Объём до 250 строк позволяет отправить решение прямо в LMS без обязательных ссылок на GitHub и GitHub Pages.

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

### 01-render-commit/package.json

```json
{
  "name": "techorda-01-render-commit",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5173 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4173 --strictPort"
  }
}
```

### 01-render-commit/index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>01. Render и commit · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 01-render-commit/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../node_modules/.vite/01-render-commit',
  base: './',
});
```

### 01-render-commit/src/main.jsx

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

### 01-render-commit/src/App.jsx

```jsx
import { useEffect, useRef, useState } from 'react';

let activeObservers = 0;

function Child({ title }) {
  const nodeRef = useRef(null);
  console.log('[render] Child: title =', title);

  useEffect(() => {
    const node = nodeRef.current;
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        console.log('[DOM] Child:', {
          type: record.type,
          oldValue: record.oldValue,
          text: node.textContent,
        });
      }
    });
    observer.observe(node, {
      childList: true,
      characterData: true,
      characterDataOldValue: true,
      subtree: true,
    });
    activeObservers += 1;
    console.log('[observer] setup; active =', activeObservers);

    return () => {
      observer.disconnect();
      activeObservers -= 1;
      console.log('[observer] cleanup; active =', activeObservers);
    };
  }, []);

  return (
    <section ref={nodeRef} aria-label="Наблюдаемый ребёнок">
      <h2>{title}</h2>
      <p>Постоянный текст ребёнка.</p>
    </section>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [alternateTitle, setAlternateTitle] = useState(false);
  const [generation, setGeneration] = useState(0);

  return (
    <main>
      <h1>01. Render и commit</h1>
      <p>Откройте DevTools → Console и сравните логи [render], [DOM] и [observer].</p>
      <p>Счётчик родителя: <output>{count}</output></p>
      <div className="actions">
        <button onClick={() => setCount((value) => value + 1)}>Увеличить счётчик</button>
        <button onClick={() => setAlternateTitle((value) => !value)}>Изменить title</button>
        <button onClick={() => setGeneration((value) => value + 1)}>Перемонтировать ребёнка</button>
      </div>
      <Child key={generation} title={alternateTitle ? 'Новый заголовок' : 'Исходный заголовок'} />
      <p>При изменении счётчика ребёнок вычисляется снова; его DOM остаётся прежним.</p>
      <p>При изменении title обновляется заголовок ребёнка. Постоянный текст сохраняется.</p>
      <p>В dev-режиме StrictMode дополнительно вызывает render и проверяет очистку эффекта.</p>
    </main>
  );
}
```

### 01-render-commit/src/styles.css

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
.actions { display: flex; flex-wrap: wrap; gap: 10px; }
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
section { margin: 24px 0; padding: 20px; border: 1px solid #68707a; border-radius: 5px; }
```

## Источники

- [React: Render and Commit](https://react.dev/learn/render-and-commit).
- [React: StrictMode](https://react.dev/reference/react/StrictMode).
- [MDN: MutationObserver.observe](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe) и [disconnect](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect).
