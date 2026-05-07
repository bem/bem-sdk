# BEM SDK — Dependencies Refresh & Modernization Plan

## Цели
- Поднять весь стек на latest версии (на момент 2026-05-08).
- Перевести монорепо на **pnpm workspaces + Changesets**, выкинуть Lerna.
- Перевести исходники на **TypeScript** (плотнее) с публикацией готовых `.d.ts`.
- Минимальный Node — `>= 20` (готовы поднимать выше, если что-то ломается).
- Заменить устаревшие/мёртвые зависимости на нативный Node API или живые альтернативы.
- CI: GitHub Actions вместо Travis/AppVeyor.
- Релиз — новая мажорная версия каждого пакета (allowed breaking changes).

## Latest версии (на 2026-05-08)

### Тулинг
| Пакет | Новая |
|---|---|
| pnpm | 11.0.8 |
| @changesets/cli | 2.31.0 |
| typescript | 6.0.3 |
| tsx | 4.21.0 |
| eslint | 10.3.0 |
| @eslint/js | 10.0.1 |
| typescript-eslint | 8.59.2 |
| mocha | 11.7.5 |
| chai | 6.2.2 |
| chai-as-promised | 8.0.2 |
| sinon | 22.0.0 |
| c8 | 11.0.0 |
| @types/node | 25.6.2 |
| @types/chai | 5.2.3 |
| @types/sinon | 21.0.1 |
| @types/chai-as-promised | 8.0.2 |
| @types/proxyquire | 1.3.31 |

### Прод-deps (что оставляем)
| Пакет | Новая |
|---|---|
| debug | 4.4.3 |
| glob | 13.0.6 |
| is-glob | 4.0.3 |
| json5 | 2.2.3 |
| node-eval | 2.0.0 |
| graceful-fs | 4.2.11 |
| stringify-object | 6.0.0 |
| common-tags | 1.8.2 |
| benchmark | 2.1.4 |
| betterc | 1.3.0 |
| change-case | 5.4.4 |

### Кандидаты на удаление (в пользу нативного Node)
| Сейчас | Замена |
|---|---|
| `es6-promisify` | `util.promisify` |
| `mz` | `node:fs/promises` |
| `pinkie-promise` | нативный `Promise` |
| `graceful-fs` (точечно) | нативный `fs` |
| `async-each` | `Promise.all` / `for await` |
| `es6-error` | `class extends Error` |
| `lodash.flatten` | `Array.prototype.flat()` |
| `lodash.clonedeep` | `structuredClone` |
| `lodash.isequal` | `node:util.isDeepStrictEqual` (deprecated в npm) |
| `lodash` (полный, в graph) | targeted-replace на нативное / точечные импорты |
| `camel-case`, `pascal-case` | `change-case` либо мини-функции |
| `tslint` + `tslint-config-typings` | typescript-eslint + eslint flat config |
| `nyc` | `c8` |
| `proxyquire` | мок-функции `node:test` / Vitest-стиль |
| `mock-fs` | `memfs` (если нужно) или интеграционные тесты |
| `depd` | `util.deprecate` |
| `chai-subset` | встроено в chai |
| `eslint-config-pedant` | свой минимальный flat-config |
| Greenkeeper-конфиги | удалить, использовать Renovate/Dependabot |

### Пакеты, требующие отдельного исследования
- `xamel` (XML, в keyset) — кандидат `fast-xml-parser` 5.x.
- `node-eval` — лёгкий wrapper над `vm`. Проверить, используется ли что-то нестандартное.
- `hash-set`, `ho-iter` (graph) — узкие итераторы; в Node 24 есть Iterator helpers.
- `xamel`, `mz` глубокие зависимости — мини-аудит вызовов.

## Фазы

### Фаза 0. Инфраструктура работы
- [x] Worktree `.worktrees/deps-refresh` (ветка `chore/deps-refresh`).
- [x] `.gitignore` обновлён.
- [x] План зафиксирован.

### Фаза 1. Монорепо: pnpm + changesets
- [ ] `package.json` корня: `packageManager`, `workspaces` нет (pnpm в `pnpm-workspace.yaml`).
- [ ] `pnpm-workspace.yaml` со списком `packages/*`.
- [ ] Удалить `lerna.json`, `lerna-debug.log` и упоминания.
- [ ] Подключить `@changesets/cli`, инициализировать `.changeset/`.
- [ ] Удалить `.npmrc`-флаг `package-lock=false`, добавить нужные настройки pnpm.

### Фаза 2. Node + TypeScript baseline
- [ ] Поднять `engines.node` до `>= 20` во всех пакетах.
- [ ] Корневой `tsconfig.base.json` (NodeNext, target ES2023, strict).
- [ ] Каждый пакет: свой `tsconfig.json` (extends base).
- [ ] `tsx` для dev-запуска тестов / скриптов.

### Фаза 3. Тулинг
- [ ] ESLint 10 (flat config, `eslint.config.js`), удалить `.eslintrc.js`, `tslint.json`, `eslint-config-pedant`.
- [ ] typescript-eslint 8 (recommended-type-checked).
- [ ] Mocha 11 + Chai 6 + Sinon 22 + chai-as-promised 8 (ESM, через `mocha --import`).
- [ ] c8 вместо nyc.
- [ ] Удалить proxyquire / mock-fs если возможно (или обновить).

### Фаза 4. CI
- [ ] `.github/workflows/ci.yml`: Node 20/22/24 + lint + typecheck + tests + coverage.
- [ ] `.github/workflows/release.yml`: Changesets release.
- [ ] Удалить `.travis.yml`, `appveyor.yml`.
- [ ] Renovate (`renovate.json`) — bot для авто-bump.

### Фаза 5. Миграция исходников на TS
Порядок — снизу вверх по графу зависимостей (листья сначала):
1. Утилиты без внутренних BEM-зависимостей: `naming.cell.pattern-parser`, `entity-name`, `naming.presets`, `import-notation`, `keyset`, `bemjson-node`.
2. Парсеры/стрингификаторы: `naming.entity.parse`, `naming.entity.stringify`, `naming.entity`, `naming.cell.stringify`, `naming.cell.match`, `naming.file.stringify`.
3. Доменные модели: `cell`, `file`.
4. Высокоуровневые: `decl`, `bemjson-to-decl`, `bemjson-to-jsx`, `bundle`, `config`.
5. Сложные: `graph`, `walk`, `deps`.

Каждый пакет: `index.js`/`lib/*.js` → `src/*.ts`, `tsc --build`, выходит в `dist/`. Публикация через `dist/`.

### Фаза 6. «Нативизация»
Один пакет — один коммит на удаление:
- `decl`: `es6-promisify` → `util.promisify`; `graceful-fs` → `fs/promises`.
- `deps`: `mz` → `fs/promises`; `debug` 2 → 4.
- `walk`: `async-each` → `Promise.all`; `depd` → `util.deprecate`.
- `cell`, `file`, `entity-name`: `depd` → `util.deprecate`; `es6-error` → нативный.
- `config`: `pinkie-promise` → удалить; `lodash.flatten`/`clonedeep` → нативное; `glob` 7 → 13.
- `graph`: полный `lodash` → targeted-replace; `hash-set`/`ho-iter` — аудит.
- `bemjson-to-jsx`: `camel-case`+`pascal-case` → мини-функции.
- `keyset`: исследование `xamel`.

### Фаза 7. Релиз
- [ ] Обновить README/CONTRIBUTING.
- [ ] `changeset` для каждого затронутого пакета (major).
- [ ] `pnpm changeset version` → bump версий.
- [ ] Dry-run `pnpm -r publish --dry-run`.
- [ ] PR в master.

## Риски
- Chai 6 / chai-as-promised 8 — ESM-only; mocha 11 поддерживает ESM, потребуется выправление импортов в тестах.
- TypeScript 6 — свежий мажор, возможна несовместимость с typescript-eslint 8.x — вернёмся на TS 5.x при необходимости.
- ESLint 10 — flat config обязателен.
- Glob 9+ — изменён API (нет default-export, sync API через `globSync`).
- `node-eval`, `xamel`, `hash-set`, `ho-iter` — кандидаты на ручной аудит.
- `proxyquire` слабо живёт в ESM-мире — потребуется заменить или DI.

## Допущения
- Внешних потребителей @bem/sdk.* у нас сейчас нет / можно ломать API в major.
- Все коммиты — атомарные, через Conventional Commits.
- Релиз — пакеты получают независимый major bump; ставка не на ребрендинг scope.
