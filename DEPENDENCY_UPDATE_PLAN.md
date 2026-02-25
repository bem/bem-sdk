# План обновления зависимостей bem-sdk

## Общая ситуация

Проект — Lerna-монорепо с 22 пакетами. Последний коммит в основную ветку — ~2019 год.
Зависимости сильно устарели (3–7 лет), некоторые deprecated, некоторые можно заменить нативными средствами Node.js.

**Текущее окружение:** Node >= 8.0 (в большинстве пакетов)
**Рекомендуемое обновление:** Node >= 18.0 (LTS, поддержка до 2025-04)

---

## Фаза 0: Инфраструктура монорепо

### 0.1 Lerna 2.2.0 → замена на npm workspaces или Lerna 9.x

| Что | Сейчас | Предложение |
|-----|--------|-------------|
| lerna.json `"lerna": "2.2.0"` | Lerna 2.x (deprecated) | **Вариант A (рекомендуется):** Перейти на `npm workspaces` (нативная поддержка в npm 7+) — убрать зависимость от lerna целиком |
| | | **Вариант B:** Обновить до Lerna 9.0.4 (требует Nx) |

**Обоснование варианта A:** Для данного проекта (без publish pipeline) npm workspaces достаточно — это нативное решение без внешних зависимостей. Нужно добавить `"workspaces": ["packages/*"]` в корневой `package.json`.

### 0.2 CI/CD: Travis CI + AppVeyor → GitHub Actions

| Что | Сейчас | Предложение |
|-----|--------|-------------|
| `.travis.yml` | Travis CI, Node 8 / 10.4 | Удалить, заменить на GitHub Actions |
| `appveyor.yml` | AppVeyor, Node 8 / 10 | Удалить, заменить на GitHub Actions |

GitHub Actions позволяет тестировать на Linux/macOS/Windows в одном workflow с матрицей Node 18 / 20 / 22.

### 0.3 Node.js engine

В `package.json` всех пакетов обновить `"engines": { "node": ">= 18.0" }`.

---

## Фаза 1: Тестирование и покрытие (devDependencies корня)

| Пакет | Сейчас | Последняя | Рекомендация | Breaking changes / заметки |
|-------|--------|-----------|-------------|---------------------------|
| **mocha** | 3.4.2 | 11.7.5 | → **11.x** | ESM-first, новый CLI. Большой скачок — нужна проверка всех тестов |
| **chai** | 4.1.2 | 6.2.2 | → **6.x** | v5+ — ESM-only. Если проект остаётся CJS — **оставить 4.x** или мигрировать на `node:assert` |
| **nyc** | 11.0.3 | 17.1.0 | → **заменить на c8** (10.1.3) | `c8` — нативное покрытие через V8, не нужен babel/istanbul. Рекомендуется для Node 18+ |
| **sinon** | 2.3.6 | 21.0.1 | → **21.x** | Полностью ESM с v15+. Для CJS — **оставить 14.x** или мигрировать |
| **proxyquire** | 1.8.0 | 2.1.3 | → **2.1.3** | Минорное обновление |
| **mock-fs** | 4.4.1 | 5.5.0 | → **5.5.0** | v5 — breaking: изменён API для symlinks |
| **typescript** | 2.4.1 | 5.9.3 | → **5.9.x** | Огромный скачок. Нужна ревизия всех .d.ts файлов |
| **@types/chai** | 4.0.1 | 5.2.3 | → **Не нужен** если chai 6 (встроенные типы) или при переходе на node:assert |
| **@types/sinon** | 2.1.2 | 21.0.0 | → **Обновить вслед за sinon** |
| **@types/proxyquire** | 1.3.27 | 1.3.31 | → **1.3.31** |
| **@types/node** | 8.0 | 25.3.0 | → **18.x** (соответственно минимальной Node) |

---

## Фаза 2: Линтинг (devDependencies корня)

| Пакет | Сейчас | Последняя | Рекомендация | Заметки |
|-------|--------|-----------|-------------|---------|
| **eslint** | 4.19.1 | 10.0.1 | → **9.x или 10.x** | v9 — flat config (`eslint.config.js`). Полностью другая конфигурация |
| **eslint-config-pedant** | 0.10.0 | 1.0.1 | → **1.0.1** | Проверить совместимость с ESLint 9+ |
| **tslint** | 5.0.0 | 6.1.3 (DEPRECATED) | → **Удалить** | TSLint deprecated с 2019. Заменить на `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` |
| **tslint-config-typings** | 0.3.1 | 0.3.1 | → **Удалить** вместе с TSLint |

### Замена TSLint:
```
Удалить: tslint, tslint-config-typings
Добавить: @typescript-eslint/eslint-plugin, @typescript-eslint/parser
```
Создать правила для .d.ts файлов в едином конфиге ESLint.

---

## Фаза 3: Продакшн-зависимости пакетов

### 3.1 Замена на нативные средства Node.js 18+

| Пакет | Используется в | Замена | Обоснование |
|-------|---------------|--------|-------------|
| **pinkie-promise** (2.0.1) | config | **Удалить** | `Promise` встроен в Node.js с v4. Полностью не нужен |
| **es6-promisify** (5.0.0) | decl | **Удалить** | `util.promisify()` встроен в Node.js с v8 |
| **mz** (2.4.0) | deps | **Заменить на `fs/promises`** | `fs.promises` / `require('fs/promises')` встроен в Node 18+ |
| **graceful-fs** (4.1.11) | decl | **Удалить** или заменить на нативный `fs` | В Node 18+ EMFILE-проблемы редки. Для простых операций нативный fs достаточен |
| **async-each** (1.0.1) | walk | **Заменить на `Promise.all` / `for...of`** | Тривиальная утилита, не нужна с async/await |
| **es6-error** (4.0.2) | graph, entity-name | **Удалить** | Нативный `class MyError extends Error {}` работает с Node 6+ |
| **json5** (0.5.1) | decl | → **2.2.3** или заменить | v0.5 — очень старая. Если JSON5 нужен — обновить до 2.x. Если нет — использовать JSON.parse() |
| **hash-set** (1.0.1) | graph, import-notation | **Заменить на нативный `Set`** | ES6 `Set` встроен в Node.js |
| **ho-iter** (0.3.0) | graph | **Заменить на нативные итераторы/генераторы** | Symbol.iterator и генераторы встроены |
| **uniq** (1.0.1) | (если используется) | **Заменить на `[...new Set(arr)]`** | Тривиальная операция |

### 3.2 Обновление до актуальных версий

| Пакет | Сейчас | Последняя | Рекомендация | Заметки |
|-------|--------|-----------|-------------|---------|
| **depd** | 1.1.0 | 2.0.0 | → **2.0.0** | Deprecation-предупреждения. v2 — ESM+CJS dual |
| **debug** | 2.6.9 | 4.4.3 | → **4.4.x** | Популярная библиотека отладки. v3+ — breaking changes в форматтерах |
| **glob** | ^7.0.5 | 13.0.6 | → **10.x+** | v8+ — breaking: убраны callbacks, только promises. v10+ — ESM. Или заменить на `fast-glob` (3.3.3) |
| **betterc** | ^1.3.0 | 1.3.0 | **Актуальна** | Без изменений |
| **node-eval** | 1.1.0 / ^2.0.0 | 2.0.0 | → **2.0.0** везде | Унифицировать версию |
| **camel-case** | ^3.0.0 | 5.0.0 | → **4.x** (CJS) или **5.x** (ESM) | v4+ — breaking API. Используется в bemjson-to-jsx |
| **pascal-case** | ^2.0.1 | 4.0.0 | → **3.x** (CJS) или **4.x** (ESM) | Аналогично camel-case |
| **stringify-object** | ^3.2.0 | 6.0.0 | → **5.x** (CJS) или **6.x** (ESM) | Используется в bemjson-to-decl |
| **xamel** | ^0.3.1 | 0.3.1 | **Актуальна** | Без изменений |
| **is-glob** | ^3.1.0 | 4.0.3 | → **4.0.3** | Минорное обновление |

### 3.3 Lodash — консолидация и замена

| Пакет | Используется в | Рекомендация |
|-------|---------------|-------------|
| **lodash** (4.17.15) | graph | → **4.17.23** (security patches) |
| **lodash.clonedeep** | config | → `structuredClone()` (Node 17+) |
| **lodash.flatten** | config | → `Array.prototype.flat()` (Node 11+) |
| **lodash.isequal** | config | Оставить или заменить на `util.isDeepStrictEqual()` (Node 9+) |
| **lodash.mergewith** | config | Оставить (нет нативного аналога) или написать простую функцию |
| **lodash.uniqwith** | config | Оставить или заменить на кастомную функцию с `Set` |

**Рекомендация:** заменить `lodash.clonedeep` → `structuredClone()`, `lodash.flatten` → `.flat()`, `lodash.isequal` → `util.isDeepStrictEqual()`. Для `mergewith` и `uniqwith` — оставить lodash или использовать единый импорт `lodash/mergeWith` вместо отдельных пакетов.

---

## Фаза 4: DevDependencies пакетов

| Пакет | Используется в | Рекомендация |
|-------|---------------|-------------|
| **matcha** (^0.7.0) | decl (бенчмарки) | → заменить на **benchmark** (2.1.4) или **tinybench** | matcha заброшен |
| **benchmark** (^2.1.0) | walk | → **2.1.4** (актуальна) |
| **chai-as-promised** (^7.0.0) | config | → **8.0.2** |
| **@types/chai-as-promised** (0.0.31) | config | → обновить или убрать если chai обновлён |
| **chai-subset** (^1.6.0) | walk | → **1.6.0** (актуальна) |
| **common-tags** (^1.8.0) | keyset | → **1.8.2** (актуальна) |
| **stream-to-array** (^2.3.0) | walk, deps | → **2.3.0** (актуальна) |
| **through2** (^2.0.1) | deps | → заменить на нативный `stream.Transform` (Node 18+) |
| **promise-map-series** (^0.2.2) | walk | → заменить на `for...of` + `await` |

---

## Фаза 5: Решение по CJS vs ESM

**Ключевой вопрос:** мигрировать на ESM или оставить CJS?

### Вариант A: Оставить CJS (минимальные усилия)
- chai оставить на 4.x, sinon на 14.x
- camel-case/pascal-case на 4.x
- glob заменить на fast-glob 3.x

### Вариант B: Полная миграция на ESM (рекомендуется для нового проекта)
- Добавить `"type": "module"` во все package.json
- Обновить все зависимости до последних ESM-версий
- Переписать require → import
- Значительный объём работы

### Рекомендация: **Вариант A** (CJS) — проект не активно развивается, минимальные усилия.

---

## Порядок выполнения

```
Фаза 0: Инфраструктура (npm workspaces, GH Actions, Node >= 18)
    ↓
Фаза 3.1: Замена на нативные средства (pinkie-promise, es6-promisify, mz, ...)
    ↓
Фаза 3.3: Lodash — замена clonedeep/flatten/isequal на нативные
    ↓
Фаза 3.2: Обновление prod-зависимостей (depd, debug, glob, ...)
    ↓
Фаза 2: Линтинг (ESLint 9+, удаление TSLint)
    ↓
Фаза 1: Тестирование (mocha 11, c8, sinon 14, ...)
    ↓
Фаза 4: Dev-зависимости пакетов
    ↓
Фаза 5: (Опционально) ESM-миграция
```

---

## Сводка: что можно полностью удалить (замена на нативные средства Node 18+)

| Удаляемый пакет | Нативная замена |
|-----------------|-----------------|
| pinkie-promise | `Promise` (встроен) |
| es6-promisify | `util.promisify()` |
| mz | `fs/promises`, `child_process` с promisify |
| es6-error | `class Err extends Error {}` |
| graceful-fs | `fs` / `fs/promises` |
| async-each | `Promise.all()` / `for await...of` |
| hash-set | `Set` |
| ho-iter | Нативные итераторы/генераторы |
| lodash.clonedeep | `structuredClone()` |
| lodash.flatten | `Array.prototype.flat()` |
| lodash.isequal | `util.isDeepStrictEqual()` |
| tslint | `@typescript-eslint` (через ESLint) |
| tslint-config-typings | `@typescript-eslint` |
| through2 | `stream.Transform` |
| promise-map-series | `for...of` + `await` |
| nyc | `c8` (V8 native coverage) |

**Итого: 16 пакетов можно удалить**, заменив на встроенные средства Node.js 18+.
