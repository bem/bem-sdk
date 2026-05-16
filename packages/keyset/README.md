# @bem/sdk.keyset

> In-memory representation of a BEM i18n keyset: a directory of
> per-language files, each containing simple, parameterised or plural
> keys, in the `taburet` or `enb` format.

[![npm](https://img.shields.io/npm/v/@bem/sdk.keyset.svg)](https://www.npmjs.org/package/@bem/sdk.keyset)

## Install

```sh
pnpm add @bem/sdk.keyset
```

Requires **Node.js >= 20** and ESM (`"type": "module"` in your
`package.json`, or use `import()` from CJS).

## Usage

```ts
import { Keyset, LangKeys, Key, ParamedKey, PluralKey } from '@bem/sdk.keyset';

const keyset = new Keyset('Time', 'src/features/Time/Time.i18n', 'taburet');

const en = new LangKeys('en', [
  new Key('hello', 'Hello'),
  new ParamedKey('greet', 'Hi, {name}!', ['name']),
  new PluralKey('items', {
    one:  new Key('items', '{count} item'),
    some: new Key('items', '{count} items'),
    many: new Key('items', '{count} items'),
    none: new Key('items', 'No items'),
  }),
]);

keyset.addKeysForLang('en', en);

await keyset.save(); // writes Time/en.ts (and index.ts for taburet)
```

Round-trip:

```ts
const restored = new Keyset('Time', 'src/features/Time/Time.i18n', 'taburet');
await restored.load();
```

## API

### `class Keyset`

#### `new Keyset(name: string, path?: string, format?: FormatName): Keyset`

`format` is `'taburet'` (default, emits `.ts`) or `'enb'` (emits `.js`).

#### `keyset.addKeysForLang(lang: string, keys: LangKeys): void`

Attach a `LangKeys` for a language code.

#### `keyset.getLangKeysForLang(lang: string): LangKeys | undefined`

#### `keyset.getKeysForLang(lang: string): Key[] | Record<string, never>`

#### `keyset.save(): Promise<void>`

Write one file per language to `path`. Re-creates the directory.

#### `keyset.load(): Promise<void>`

Read files from `path` back into the keyset.

#### `Keyset.merge(...keysets: Keyset[]): Keyset` / `keyset.merge(...others: Keyset[]): Keyset`

> Added in current release (closes #350).

Return a new keyset whose per-language `LangKeys` are the result of
`LangKeys.merge` across all inputs. The instance method is shorthand
for `Keyset.merge(this, ...others)`.

#### Read-only state

- `keyset.langs: string[]`
- `keyset.langKeys: Map<string, LangKeys>`
- `keyset.errors: Error[]`
- `keyset.isBroken: boolean`
- Iterable over `[lang, LangKeys]` pairs.

### `class LangKeys`

#### `new LangKeys(lang?: string, keys?: Iterable<Key>, keysetName?: string): LangKeys`

#### `langKeys.keys: Key[]`

All `Key` instances as an array.

#### `langKeys.stringify(formatName: FormatName): string`

Render to source text.

#### `LangKeys.parse(source: string, formatName: FormatName): Promise<LangKeys>`

Inverse of `stringify`.

#### `LangKeys.merge(...langs: LangKeys[]): LangKeys`

> Added in current release (closes #350).

Union of keys; later inputs override earlier ones on conflict.

### `class Key`, `class ParamedKey`, `class PluralKey`

- `new Key(name: string, value: string): Key` — plain string key.
- `new ParamedKey(name: string, value: string, params: string[]): ParamedKey` — adds a list of placeholder names.
- `new PluralKey(name: string, forms: PluralForms): PluralKey` — `forms`
  is a partial map over `'one' | 'some' | 'many' | 'none'`.

For exhaustive typings (`KeyValue`, `PluralForm`, `PluralForms`,
`FormatName`) see `dist/index.d.ts`.

## License

MPL-2.0
