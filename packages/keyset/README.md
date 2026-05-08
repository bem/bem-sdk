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

- `new Keyset(name, path?, format?)` — `format` is `'taburet'` (default,
  emits `.ts`) or `'enb'` (emits `.js`).
- `addKeysForLang(lang, langKeys)` — attach a `LangKeys` for a
  language code.
- `getLangKeysForLang(lang)`, `getKeysForLang(lang)` — lookup helpers.
- `save(): Promise<void>` — writes one file per language to `path`.
  Re-creates the directory.
- `load(): Promise<void>` — reads files from `path` back into the
  keyset.
- `langs`, `langKeys`, `errors`, `isBroken` — read-only state.
- Iterable over `[lang, LangKeys]` pairs.

### `class LangKeys`

- `new LangKeys(lang?, keys?, keysetName?)`.
- `keys` — all `Key`s as an array.
- `stringify(formatName)` — render to source text.
- `static parse(source, formatName): Promise<LangKeys>` — inverse of
  `stringify`.

### `class Key`, `class ParamedKey`, `class PluralKey`

- `Key(name, value)` — plain string key.
- `ParamedKey(name, value, params)` — adds a list of placeholder names.
- `PluralKey(name, forms)` — `forms` is a partial map over
  `'one' | 'some' | 'many' | 'none'`.

For exhaustive typings, see `KeyValue`, `PluralForm`, `PluralForms`,
`FormatName` in `dist/index.d.ts`.

## License

MPL-2.0
