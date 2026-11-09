# 06. Управляемый и неуправляемый фильтр

Два фильтра одного локального набора courses.json. Оба поля начинают со строки React. Управляемый фильтр обновляет список при вводе; неуправляемый читает DOM-значение через ref по кнопке «Применить».

## Владелец значения и внешний сброс

ControlledFilter получает value и onChange от App. Текущий текст хранится в controlledText; обработчик передаёт введённую строку в setter. Внешняя кнопка сброса вызывает setControlledText(''): React очищает input и показывает все курсы.

UncontrolledFilter получает ref, а input — только defaultValue="React" и ref, без value и onChange. Браузер хранит текущий ввод. Нажатие «Применить» читает uncontrolledRef.current.value и сохраняет снимок запроса в appliedQuery для списка. appliedQuery не управляет самим input.

Кнопки сброса находятся в App, снаружи компонентов фильтров. Сброс неуправляемого варианта явно делает два действия: присваивает uncontrolledRef.current.value = '' и вызывает setAppliedQuery(''). Если очистить только state, текст останется в поле; если очистить только DOM, список останется отфильтрованным. Здесь сброс означает пустой запрос и все четыре курса, а не возврат к исходному React.

В одном input не смешиваются value и defaultValue; компоненты не переключают режим владения. Чтение и запись ref выполняются в обработчиках, не при render. После сброса повторный ввод и применение работают без перемонтирования поля.

## Почему изменение defaultValue не управляет текущим вводом

defaultValue задаёт исходное значение неуправляемого input. После пользовательского редактирования текущий input.value и значение по умолчанию input.defaultValue могут различаться. Изменение defaultValue не является контрактом синхронизации текущего текста с React props; оно также может влиять на значение по умолчанию для сброса формы.

Для постоянного управления текущим вводом нужны value со строкой из state и onChange, который обновляет эту строку. В неуправляемом варианте текущее значение читается или изменяется явно через DOM/ref. В примере нет Effect, который копировал бы defaultValue в текущее значение.

## Версии и запуск

React / React DOM 19.3.1, Vite 8.3.6, @vitejs/plugin-react 6.3.0. Проверено на Node.js 20.20.2 и npm 10.9.4.

Корневой package.json сохраните в Advanced_React, остальные файлы — по путям ниже. При создании проекта из текста выполните из Advanced_React:

```bash
npm install
npm run dev:06
```

В полном репозитории сохранён общий Advanced_React/package-lock.json; установка из него — npm ci. Все задания используют один Advanced_React/node_modules. Dev: http://127.0.0.1:5178/.

Production:

```bash
npm run build --workspace=06-controlled-uncontrolled
npm run preview:06
```

Preview: http://127.0.0.1:4178/.

## Результат самопроверки

Установка по общему lockfile и сборка всех шести workspaces прошли. Браузерная проверка через Playwright Core и Brave прошла в dev + StrictMode и production:

- Оба поля и применённые запросы начинают с React; в каждом списке один курс.
- Управляемый список меняется при вводе. В неуправляемом поле ввод не меняет список до «Применить».
- Изменение другого фильтра и render родителя сохраняют неуправляемый черновик и тот же DOM-узел.
- Три цикла ввода, применения и сброса с запросами тип, сЕРВЕР и нет такого курса дали один, один и ноль результатов. После сброса поля и запросы пусты, показаны четыре курса; повторный ввод работает.
- Повторный сброс и сброс ещё не применённого черновика работают, даже если appliedQuery уже пустой. Поле не перемонтируется.
- Очистка неуправляемого поля вручную сохраняет прежний применённый список; нажатие «Применить» показывает все курсы.
- Enter и Space активируют кнопки применения и сброса.
- В DOM-проверке после ввода сервер замена input.defaultValue на другую строку не изменила текущий input.value. Это проверка DOM-свойства, а не смена React props или дополнительная функция приложения.
- Ошибок JavaScript, загрузки ресурсов и предупреждений React нет. На ширине 1280 px фильтры рядом, на 360 и 320 px — друг под другом, без горизонтальной прокрутки.

Для ручной проверки введите тип в управляемом поле и сбросьте его. В неуправляемом поле введите сервер, сравните список до и после «Применить», затем сбросьте и повторите ввод. Неприменённый текст должен переживать изменения управляемого фильтра.

Собственный HTML/CSS/JS/JSX — **112 непустых строк**. Решение можно отправить прямо в LMS без обязательной публикации GitHub Pages. Проверяемый шаг в локальном репозитории TechOrda отмечен тегом react-06; SHA: git rev-parse react-06.

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

### 06-controlled-uncontrolled/package.json

```json
{
  "name": "techorda-06-controlled-uncontrolled",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 5178 --strictPort",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1 --port 4178 --strictPort"
  }
}
```

### 06-controlled-uncontrolled/index.html

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>06. Управляемый и неуправляемый фильтр · TechOrda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 06-controlled-uncontrolled/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  cacheDir: '../node_modules/.vite/06-controlled-uncontrolled',
  base: './',
});
```

### 06-controlled-uncontrolled/src/main.jsx

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

### 06-controlled-uncontrolled/src/courses.json

```json
[
  {"id":"react","title":"React-интерфейсы","category":"frontend","seats":12,"version":1},
  {"id":"typescript","title":"Типизация данных","category":"frontend","seats":0,"version":1},
  {"id":"next","title":"Серверный rendering","category":"fullstack","seats":8,"version":1},
  {"id":"testing","title":"Проверка поведения UI","category":"quality","seats":5,"version":1}
]
```

### 06-controlled-uncontrolled/src/App.jsx

```jsx
import { useRef, useState } from 'react';
import courses from './courses.json';

function ControlledFilter({ value, onChange }) {
  return (
    <label>Поиск по названию
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function UncontrolledFilter({ inputRef }) {
  return (
    <label>Поиск по названию
      <input type="search" defaultValue="React" ref={inputRef} />
    </label>
  );
}

function Results({ query }) {
  const visible = courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <p>Применённый запрос: «<output>{query}</output>»</p>
      <p>Найдено: {visible.length} из {courses.length}.</p>
      <ul>{visible.map((course) => <li key={course.id}>{course.title}</li>)}</ul>
    </>
  );
}

export default function App() {
  const [controlledText, setControlledText] = useState('React');
  const [appliedQuery, setAppliedQuery] = useState('React');
  const uncontrolledRef = useRef(null);

  function resetUncontrolled() {
    uncontrolledRef.current.value = '';
    setAppliedQuery('');
  }

  return (
    <main>
      <h1>06. Управляемый и неуправляемый фильтр</h1>
      <p>Начальное значение обоих полей — React. Внешние кнопки сброса очищают запрос и возвращают все курсы.</p>
      <div className="filters">
        <section aria-labelledby="controlled-heading">
          <h2 id="controlled-heading">Управляемый фильтр</h2>
          <p>Значение хранится в React state. Список обновляется при вводе.</p>
          <ControlledFilter value={controlledText} onChange={setControlledText} />
          <div className="actions">
            <button type="button" onClick={() => setControlledText('')}>Сбросить управляемый</button>
          </div>
          <Results query={controlledText} />
        </section>
        <section aria-labelledby="uncontrolled-heading">
          <h2 id="uncontrolled-heading">Неуправляемый фильтр</h2>
          <p>Текущий ввод хранится в DOM. Список обновляется по кнопке «Применить».</p>
          <UncontrolledFilter inputRef={uncontrolledRef} />
          <div className="actions">
            <button type="button" onClick={() => setAppliedQuery(uncontrolledRef.current.value)}>Применить</button>
            <button type="button" onClick={resetUncontrolled}>Сбросить неуправляемый</button>
          </div>
          <Results query={appliedQuery} />
        </section>
      </div>
    </main>
  );
}
```

### 06-controlled-uncontrolled/src/styles.css

```css
:root {
  font-family: system-ui, sans-serif;
  color: #202124;
  background: #f6f7f8;
  line-height: 1.6;
}

* { box-sizing: border-box; }
body { margin: 0; }
main { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
h1 { font-size: 1.8rem; }
h2 { margin-top: 0; font-size: 1.25rem; }
.filters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: start; }
section { min-width: 0; padding: 20px; border: 1px solid #68707a; border-radius: 5px; overflow-wrap: anywhere; }
label { display: flex; flex-direction: column; gap: 4px; }
input, button { max-width: 100%; font: inherit; padding: 8px 12px; border: 1px solid #68707a; border-radius: 5px; background: white; color: inherit; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
button { cursor: pointer; }
button:hover { background: #e8eef5; }
:is(input, button):focus-visible { outline: 3px solid #185abc; outline-offset: 3px; }
ul { padding-left: 24px; }
@media (max-width: 700px) { .filters { grid-template-columns: 1fr; } }
```

## Источник

[React: input](https://react.dev/reference/react-dom/components/input).
