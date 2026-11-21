# 05. Карточка через композицию

[Папка решения на GitHub](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/05-course-card-composition).

Реализован общий Panel с title, children и необязательным actions. Один и тот же компонент используется для фильтра и карточек четырёх вымышленных курсов из courses.json.

## Как устроена композиция

Panel отвечает за секцию, заголовок, размещение действий и содержимого. Данные курса, фильтрация и обработчики находятся снаружи, в App. В Panel нет ветвления по id курса, сведений о категориях или специальных флагов isCourse / isFilter / showButton. Единственное условие проверяет наличие содержимого actions.

В фильтре title содержит длинный заголовок, children — подписанный select, actions отсутствует. В карточке title содержит название, children — категорию, количество мест и версию, actions — готовую нативную кнопку «Выбрать». App хранит выбранный id и показывает результат выбора в статусе. Выбор разрешён для всех четырёх курсов: бронирование и ограничения по числу мест в эту работу не входят. Записей в localStorage нет.

useId связывает каждую секцию с её заголовком через aria-labelledby. Это идентификатор разметки, а не бизнес-ветвление по id курса.

## Отсутствие actions, длинный заголовок и клавиатура

При отсутствии actions его контейнер и кнопка-заглушка не создаются. Заголовок и обёртки не имеют tabIndex; у фильтра остаётся только настоящий select.

Заголовок переносится благодаря overflow-wrap: anywhere и min-width: 0. Шапка использует flex-wrap: wrap: при недостатке ширины действия переносятся ниже, а содержимое остаётся после шапки. Длинный текст не обрезается.

Кнопки переданы снаружи как button type="button". Они получают фокус по Tab, активируются Enter и Space; для фокуса задан видимый outline. Panel не добавляет скрытых интерактивных элементов и не имитирует кнопки через div.

## Версии и запуск

React / React DOM 19.3.1, Vite 8.3.6, @vitejs/plugin-react 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4.

Корневой package.json сохраните в Advanced_React, остальные файлы — по путям ниже. При создании проекта из текста выполните из Advanced_React:

```bash
npm install
npm run dev:05
```

В полном репозитории сохранён общий Advanced_React/package-lock.json; установка из него — npm ci. Все задания используют один Advanced_React/node_modules. Dev: http://127.0.0.1:5177/.

Production:

```bash
npm run build --workspace=05-course-card-composition
npm run preview:05
```

Preview: http://127.0.0.1:4177/.

## Результат самопроверки

Установка по общему lockfile и сборка всех пяти workspaces прошли. Браузерная проверка через Playwright Core и Brave прошла в dev + StrictMode и production:

- Пять панелей: фильтр и четыре карточки. Все секции имеют доступные имена, id заголовков уникальны.
- В фильтре без actions нет контейнера действий и кнопки-заглушки.
- Tab проходит через select и четыре кнопки, без лишних остановок. Shift+Tab возвращает на предыдущую кнопку; фокус виден.
- Все четыре курса выбраны с клавиатуры: Enter для React и Next, Space для TypeScript и Testing. Статус показывает соответствующий курс.
- Фильтр показывает 2 курса Frontend, 1 Fullstack, 1 Quality и 4 при выборе всех направлений.
- На ширине 1280 / 360 / 320 px длинный заголовок фильтра занимает 2 / 4 / 6 строк. Горизонтальной прокрутки и перекрытия элементов нет.
- Для CSS-проверки в DOM карточки временно подставлен длинный заголовок без пробелов: заголовок, actions и тело сохранили структуру на 1280 и 320 px. Данные приложения не менялись.
- Ошибок JavaScript и загрузки ресурсов нет.

Для ручной проверки используйте Tab, Enter, Space и категории; уменьшите окно до 320 px и проверьте перенос длинного заголовка фильтра.

Собственный HTML/CSS/JS/JSX — **97 непустых строк**. Решение можно отправить прямо в LMS без обязательной публикации GitHub Pages. Проверяемый шаг в локальном репозитории TechOrda отмечен тегом react-05; SHA: git rev-parse react-05.

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
    "dev:01": "npm run dev --workspace=01-render-commit-counter",
    "dev:02": "npm run dev --workspace=02-pure-render-course-selection",
    "dev:03": "npm run dev --workspace=03-use-transition-input-priority",
    "dev:04": "npm run dev --workspace=04-use-deferred-value-stale-results",
    "dev:05": "npm run dev --workspace=05-course-card-composition",
    "dev:06": "npm run dev --workspace=06-controlled-uncontrolled-filters",
    "build": "npm run build --workspaces",
    "preview:01": "npm run preview --workspace=01-render-commit-counter",
    "preview:02": "npm run preview --workspace=02-pure-render-course-selection",
    "preview:03": "npm run preview --workspace=03-use-transition-input-priority",
    "preview:04": "npm run preview --workspace=04-use-deferred-value-stale-results",
    "preview:05": "npm run preview --workspace=05-course-card-composition",
    "preview:06": "npm run preview --workspace=06-controlled-uncontrolled-filters"
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

### 05-course-card-composition/package.json

```json
{
  "name": "techorda-05-course-card-composition",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5177 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4177 --strictPort"
  }
}
```

### 05-course-card-composition/index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>05. Карточка через композицию · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 05-course-card-composition/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../node_modules/.vite/05-course-card-composition',
  base: './',
});
```

### 05-course-card-composition/src/main.jsx

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

### 05-course-card-composition/src/Panel.jsx

```jsx
import { useId } from 'react';

export default function Panel({ title, children, actions }) {
  const titleId = useId();
  return (
    <section className="panel" aria-labelledby={titleId}>
      <header className="panel__header">
        <h2 id={titleId}>{title}</h2>
        {actions ? <div className="panel__actions">{actions}</div> : null}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
```

### 05-course-card-composition/src/courses.json

```json
[
  {"id":"react","title":"React-интерфейсы","category":"frontend","seats":12,"version":1},
  {"id":"typescript","title":"Типизация данных","category":"frontend","seats":0,"version":1},
  {"id":"next","title":"Серверный rendering","category":"fullstack","seats":8,"version":1},
  {"id":"testing","title":"Проверка поведения UI","category":"quality","seats":5,"version":1}
]
```

### 05-course-card-composition/src/App.jsx

```jsx
import { useState } from 'react';
import Panel from './Panel.jsx';
import courses from './courses.json';

export default function App() {
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const visible = courses.filter((course) => category === 'all' || course.category === category);
  const selectedCourse = courses.find((course) => course.id === selectedId);

  return (
    <main>
      <h1>05. Карточка через композицию</h1>
      <Panel title="Фильтр курсов: выберите направление обучения, чтобы найти подходящую программу">
        <label>Категория
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">Все направления</option>
            <option value="frontend">Frontend</option>
            <option value="fullstack">Fullstack</option>
            <option value="quality">Quality</option>
          </select>
        </label>
      </Panel>
      <p role="status">{selectedCourse ? `Выбран курс: ${selectedCourse.title}` : 'Курс ещё не выбран.'}</p>
      {visible.map((course) => (
        <Panel
          key={course.id}
          title={course.title}
          actions={<button type="button" onClick={() => setSelectedId(course.id)}>Выбрать</button>}
        >
          <p>Категория: {course.category}.</p>
          <p>Свободных мест: {course.seats}. Версия: {course.version}.</p>
        </Panel>
      ))}
    </main>
  );
}
```

### 05-course-card-composition/src/styles.css

```css
:root {
  font-family: system-ui, sans-serif;
  color: #202124;
  background: #f6f7f8;
  line-height: 1.6;
}

* { box-sizing: border-box; }
body { margin: 0; }
main { max-width: 800px; margin: 40px auto; padding: 0 20px; }
h1 { font-size: 1.8rem; }
.panel { min-width: 0; margin: 20px 0; padding: 20px; border: 1px solid #68707a; border-radius: 5px; }
.panel__header { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 12px; }
.panel__header h2 { flex: 1 1 16rem; min-width: 0; margin: 0; font-size: 1.25rem; overflow-wrap: anywhere; }
.panel__actions { display: flex; flex-wrap: wrap; gap: 8px; max-width: 100%; }
.panel__body { min-width: 0; margin-top: 16px; overflow-wrap: anywhere; }
label { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
select, button { max-width: 100%; font: inherit; padding: 8px 12px; border: 1px solid #68707a; border-radius: 5px; background: white; color: inherit; }
button { cursor: pointer; }
button:hover { background: #e8eef5; }
:is(select, button):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
```

## Источники

- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component).
- [MDN: overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap).
