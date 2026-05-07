# Migration Spec — JS → TypeScript ESM

Этот документ описывает единый шаблон миграции одного пакета из BEM SDK
с CommonJS на TypeScript / ESM. Применяется для каждого пакета `packages/*`.

Эталонный пакет (готовый): `packages/naming.cell.pattern-parser/`.

## Корневая структура пакета после миграции

```
packages/<pkg>/
  src/
    index.ts            # public entry
    <other>.ts          # internal modules (export only what's public via index.ts)
    <something>.test.ts # tests (excluded from build)
  package.json
  tsconfig.json
  README.md
```

Все legacy `.js`, `.d.ts`, `index.js`, `lib/`, `test/`, `benchmark/`, `bench/`
удаляются.

## package.json — обязательные поля

```json
{
  "name": "@bem/sdk.<pkg>",
  "version": "<MAJOR_BUMP>.0.0-next.0",
  "type": "module",
  "engines": { "node": ">=20" },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "test": "mocha 'src/**/*.test.ts'"
  },
  "publishConfig": { "access": "public" }
}
```

- Внутренние BEM-deps указываются как `"@bem/sdk.foo": "workspace:^"`.
- `repository.directory` указывает на путь пакета.

## tsconfig.json (per package)

Сгенерирован скриптом `scripts/scaffold-tsconfig.mjs`. Имеет вид:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "rootDir": "src", "outDir": "dist" },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts"],
  "references": [...]
}
```

Если ты добавляешь/удаляешь prod-deps на другие @bem/sdk.*-пакеты,
перегенерируй tsconfig'ы скриптом — НЕ редактируй references вручную.

## Правила миграции исходников

1. Убрать `'use strict';`, `module.exports = …`, заменить на `export`.
2. Чёткие named exports вместо default-экспорта; default — только при необходимости совместимости.
3. Все типы — явные (interface / type), `any` — только под комментарием с обоснованием.
4. Импорты внутрипакетные — с расширением `.js` (NodeNext): `import { x } from './foo.js'`.
5. Импорты на другие BEM-пакеты — `from '@bem/sdk.foo'` (по pkg name).
6. Заменить replaceable deps на нативное API:
   - `es6-promisify` → `node:util.promisify`
   - `mz` → `node:fs/promises`
   - `pinkie-promise` → нативный `Promise`
   - `async-each` → `Promise.all` / `for await`
   - `es6-error` → `class extends Error`
   - `lodash.flatten` → `Array.prototype.flat()`
   - `lodash.clonedeep` → `structuredClone`
   - `lodash.isequal` → `node:util.isDeepStrictEqual`
   - `camel-case`/`pascal-case` → мини-функция (regex) или `change-case`
   - `depd` → `node:util.deprecate`
   - `graceful-fs` → `node:fs/promises` (если не нужны графейшн-фичи)
7. Удалить эти deps из `package.json` после реальной замены.
8. Если функция возвращает рекурсивную структуру — определить рекурсивный тип.
9. Имена функций и типов — `camelCase`/`PascalCase` (не PEP-8-style).

## Правила миграции тестов

1. Тесты — рядом с src в виде `*.test.ts`. Иерархию `test/foo/bar.test.js` уплощить в `src/__tests__/...test.ts` или `src/<feat>.test.ts`.
2. Импорты chai: `import { expect } from 'chai'` (chai 6 ESM).
3. Импорты других пакетов — по pkg name (`from '@bem/sdk.foo'`).
4. **Если зависимый пакет ещё не мигрирован**, тест откладывается:
   создай файл `src/<name>.test.skip.ts.txt` (любой не-`.ts` суффикс)
   с комментарием в начале:
   ```ts
   // TODO(migration): tests depend on unmigrated @bem/sdk.<dep>.
   ```
   Файл не запускается, IDE его не парсит. После миграции зависимостей
   переименуй обратно в `*.test.ts`.
5. Никаких `nyc`, `proxyquire`, `mock-fs` — заменяем на встроенный node:test mock,
   ручной DI, либо `memfs`.

## Что после миграции пакета

1. `pnpm install` — pnpm подцепит новые exports.
2. `pnpm --filter @bem/sdk.<pkg> build` — должно пройти без ошибок.
3. `pnpm --filter @bem/sdk.<pkg> test` — все тесты зелёные.
4. Создать changeset в `.changeset/migrate-<pkg>.md`:
   ```md
   ---
   '@bem/sdk.<pkg>': major
   ---
   Migrated to TypeScript / ESM (Node >=20).
   <Brief notes about API changes / replaced deps>.
   ```
5. Один коммит формата `refactor(<pkg>)!: migrate to TypeScript ESM`
   с BREAKING CHANGE в теле.

## Эталоны
- `packages/naming.cell.pattern-parser/` — лист, без BEM-deps, чистый src+test+package+tsconfig.
- `packages/naming.entity.stringify/` — лист, тесты переписаны без BemEntityName.

## Порядок миграции (снизу вверх по prod-deps)

Уровень 0 (нет внутр. prod-deps):
1. naming.cell.pattern-parser ✅
2. naming.entity.stringify ✅
3. naming.presets
4. bemjson-node
5. import-notation (заменить hash-set на Set)
6. keyset (исследовать xamel)
7. config (заменить pinkie-promise, lodash.flatten/clonedeep)

Уровень 1:
8. naming.cell.stringify (← pattern-parser)
9. entity-name (← naming.entity.stringify, naming.presets; убрать depd, es6-error)

Уровень 2:
10. naming.entity.parse (← entity-name)
11. cell (← entity-name; убрать depd)
12. file (← cell; убрать depd)
13. naming.cell.match (← cell, pattern-parser, naming.entity.parse)
14. naming.file.stringify (← naming.cell.stringify)
15. naming.entity (← entity-name, naming.entity.parse, naming.entity.stringify, naming.presets)
16. bemjson-to-jsx (← entity-name, naming.entity.stringify, naming.presets; заменить camel-case/pascal-case)
17. decl (← cell, entity-name; заменить es6-promisify, graceful-fs, json5 → встроенный JSON или json5 latest)

Уровень 3:
18. bemjson-to-decl (← decl, entity-name; обновить stringify-object 6)
19. bundle (← bemjson-to-decl)

Уровень 4:
20. graph (← cell, entity-name, naming.entity; убрать lodash, hash-set→Set, ho-iter→native, es6-error)
21. walk (← cell, config, entity-name, file, naming.cell.match, naming.entity.parse, naming.entity.stringify, naming.presets; заменить async-each, depd)

Уровень 5:
22. deps (← config, decl, entity-name, graph, walk; заменить mz, debug 2→4)
