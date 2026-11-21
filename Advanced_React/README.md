# Продвинутый React · TechOrda

Задания используют npm workspaces: общие зависимости и версии находятся в корневом `package.json`, дерево зависимостей — в одном `package-lock.json`, установленные пакеты — в одном `node_modules`. У каждого задания свои исходники, команды Vite и сборка `dist`.

## Установка и запуск

Из папки `Advanced_React` установите зависимости один раз:

```bash
npm ci
```

| Задание | Папка решения на GitHub | Запуск | Локальный адрес |
| --- | --- | --- | --- |
| 01. Render и commit на счётчике | [01-render-commit-counter](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/01-render-commit-counter) | `npm run dev:01` | http://127.0.0.1:5173/ |
| 02. Чистота render и выбор курса | [02-pure-render-course-selection](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/02-pure-render-course-selection) | `npm run dev:02` | http://127.0.0.1:5174/ |
| 03. Приоритет ввода через useTransition | [03-use-transition-input-priority](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/03-use-transition-input-priority) | `npm run dev:03` | http://127.0.0.1:5175/ |
| 04. Отложенное значение и старый результат | [04-use-deferred-value-stale-results](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/04-use-deferred-value-stale-results) | `npm run dev:04` | http://127.0.0.1:5176/ |
| 05. Карточка через композицию | [05-course-card-composition](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/05-course-card-composition) | `npm run dev:05` | http://127.0.0.1:5177/ |
| 06. Управляемый и неуправляемый фильтр | [06-controlled-uncontrolled-filters](https://github.com/SAQ-047/TechOrda/tree/main/Advanced_React/06-controlled-uncontrolled-filters) | `npm run dev:06` | http://127.0.0.1:5178/ |
| 07. Контейнер каталога и представление | [07-course-catalog-container](https://github.com/SAQ-047/TechOrda/tree/react-07-course-catalog-container/Advanced_React/07-course-catalog-container) | `npm run dev:07` | http://127.0.0.1:5179/ |
| 08. Подъём состояния двух фильтров | [08-lifted-course-filters](https://github.com/SAQ-047/TechOrda/tree/react-08-lifted-course-filters/Advanced_React/08-lifted-course-filters) | `npm run dev:08` | http://127.0.0.1:5180/ |
| 09. Цена useMemo | [09-use-memo-sort](https://github.com/SAQ-047/TechOrda/tree/react-09-use-memo-sort/Advanced_React/09-use-memo-sort) | `npm run dev:09` | http://127.0.0.1:5181/ |

Для одновременного запуска используйте два терминала. Внутри папки задания также работает `npm run dev`, используя общие зависимости.

Сборка всех заданий: `npm run build`. Сборка одного: `npm run build --workspace=<имя-папки-задания>`. Просмотр production-сборок: `npm run preview:01` (порт 4173), `npm run preview:02` (порт 4174), `npm run preview:03` (порт 4175), `npm run preview:04` (порт 4176), `npm run preview:05` (порт 4177), `npm run preview:06` (порт 4178), `npm run preview:07` (порт 4179), `npm run preview:08` (порт 4180), `npm run preview:09` (порт 4181).

Новые задания размещайте в папках `10-…`, `11-…` и далее: шаблон workspaces `[0-9][0-9]-*` подключает их автоматически. В их `package.json` достаточно имени, `private`, `type` и команд запуска/сборки. Общие библиотеки добавляйте в корневой `package.json`; устанавливайте зависимости из `Advanced_React`. Кеш Vite каждого задания направляйте в `../node_modules/.vite/<имя-папки>`, чтобы внутри заданий не создавались дополнительные `node_modules`.

## Задания

1. [Render и commit на счётчике](01-render-commit-counter/) · [Ответ для LMS](01-render-commit-counter/LMS.md)
2. [Чистота render и выбор курса](02-pure-render-course-selection/) · [Ответ для LMS](02-pure-render-course-selection/LMS.md)
3. [Приоритет ввода через useTransition](03-use-transition-input-priority/) · [Ответ для LMS](03-use-transition-input-priority/LMS.md)
4. [Отложенное значение и старый результат](04-use-deferred-value-stale-results/) · [Ответ для LMS](04-use-deferred-value-stale-results/LMS.md)
5. [Карточка через композицию](05-course-card-composition/) · [Ответ для LMS](05-course-card-composition/LMS.md)
6. [Управляемый и неуправляемый фильтр](06-controlled-uncontrolled-filters/) · [Ответ для LMS](06-controlled-uncontrolled-filters/LMS.md)
7. [Контейнер каталога и представление](07-course-catalog-container/) · [Ответ для LMS](07-course-catalog-container/LMS.md)
8. [Подъём состояния двух фильтров](08-lifted-course-filters/) · [Ответ для LMS](08-lifted-course-filters/LMS.md)
9. [Цена useMemo](09-use-memo-sort/) · [Ответ для LMS](09-use-memo-sort/LMS.md)

Имена папок имеют формат `NN-<тема-задания>`. В начале каждого `README.md` и `LMS.md` находится прямая ссылка на папку решения в GitHub. Учебные теги сохраняют структуру своего коммита; для текущих названий используйте ссылки на `main`.
