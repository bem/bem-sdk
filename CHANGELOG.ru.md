История изменений
=================

1.0.0
-----

### Разделитель модификатора ([#76])

Добавлена возможность отделять имя модификатора от значения модификатора указанной строкой.

Раньше можно было указать строку только для отделения имени модификатора от имени блока или элемента. Она же использовалась для разделения значения модификатора от его имени.

**Было:**

```js
var myNaming = bemNaming({
    mod: '--'
});

var obj = {              
    block: 'block',
    modName: 'mod',
    modVal: 'val'
};

myNaming.stringify(obj); // 'block--mod--val'
```

**Стало:**

```js
var myNaming = bemNaming({
    mod: { name: '--', val: '_' }
});

var obj = {              
    block: 'block',
    modName: 'mod',
    modVal: 'val'
};

myNaming.stringify(obj); // 'block--mod_val'
```

Также добавлено поле [modValDelim](modValDelim), показывающее, какая строка используется для разделения значения модификатора от его названия.

### Presets ([#81])

Добавлены предустановленные настройки стилей:
  - `origin` (по умолчанию) — стиль Яндекса (`block__elem_mod_val`).
  - `two-dashes` — стиль [Гарри Робертса](harry-roberts-convention) (`block__elem--mod_val`).

Предустановленные настройки стилей позволяют не указывать опции каждый раз при использовании стиля отличного от стиля по умолчанию.

```js
var bemNaming = require('bem-naming');

// with preset
var myNaming = bemNaming('two-dashes');
```

## Исправления ошибок

- Функции для нестандартных стилей не работали без контекста ([#72]).

  **Пример:**

  ```js

  var bemNaming = require('bem-naming');

  var myNaming = bemNaming({ mod: '--' });

  ['block__elem', 'block--mod'].map(myNaming.parse); // Функция `parse` требовала контекст объекта `myNaming`.
                                                     // Для корректной работы было необходимо
                                                     // писать так: `myNaming.parse.bind(myNaming)`.
  ```

- Вместо глобального объекта использовался `this` ([#86]).

### Удалено устаревшее

- Поле `BEMNaming` было удалено ([#74]).

  Для создания нового стиля следует использовать функцию `bemNaming`.

  ```js
  var bemNaming = require('bemNaming');

  var myNaming = bemNaming({ elem: '__', mod: '--' });
  ```

- Опции `elemSeparator`, `modSeparator` и `literal` были удалены ([#75]).

  Вместо них необходимо использовать `elem`, `mod` и `wordPattern` соответственно.

- Удалён файл `bem-naming.min.js`.

### Остальное

- Метод `stringify` должен возвращать `undefined` для невалидных объектов, а не выбрасывать ошибку ([#71]).

  Проще проверить результат на `undefined`, чем использовать `try..catch`.

  **Было:**

  ```js
  try {
      var str = bemNaming.stringify({ elem: 'elem' });
  } catch(e) { /* ... */ }
  ```

  **Стало:**

  ```js
  var str = bemNaming.stringify({ elem: 'elem' });

  if (str) {
      /* ... */
  }
  ```

[custom-naming-convention]: ./README.ru.md#custom-naming-convention
[modValDelim]:              ./README.ru.md#modvaldelim
[harry-roberts-convention]: ./README.ru.md#В-стиле-Гарри-Робертса

[#86]: https://github.com/bem/bem-naming/pull/86
[#81]: https://github.com/bem/bem-naming/pull/81
[#76]: https://github.com/bem/bem-naming/pull/76
[#75]: https://github.com/bem/bem-naming/pull/75
[#74]: https://github.com/bem/bem-naming/pull/74
[#72]: https://github.com/bem/bem-naming/pull/72
[#71]: https://github.com/bem/bem-naming/pull/71

### Commits

  * [[`4c26980996`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/4c26980996)] - style(browser): add `browser` env for eslint (blond)
  * [[`b31f3c068c`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/b31f3c068c)] - fix(global): use `window` and `global` instead of `this` (blond)
  * [[`7d5cb11f27`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/7d5cb11f27)] - docs(common-misconceptions): down info about common misconceptions (blond)
  * [[`099ee42b2e`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/099ee42b2e)] - docs(naming object): rename BEM-naming to naming object (blond)
  * [[`2d7402429f`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/2d7402429f)] - test(unknow preset): add test for unknown preset (blond)
  * [[`01e680b4f8`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/01e680b4f8)] - fix(unknow preset): throw error if preset is unknown (blond)
  * [[`7273d172b3`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/7273d172b3)] - style(jscs): remove strict options (blond)
  * [[`063ccfe877`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/063ccfe877)] - refactor(functionality): get rid of `BemNaming` class (blond)
  * [[`509a816737`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/509a816737)] - chore(package): update eslint to version 2.5.1 (greenkeeperio-bot)
  * [[`beaabbe447`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/beaabbe447)] - docs(presets): use `two-dashes` preset for convention by Harry Roberts (blond)
  * [[`a2e7bd8da4`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/a2e7bd8da4)] - test(presets): use presets (blond)
  * [[`b93bd98407`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/b93bd98407)] - feat(presets): add `two-dashes` preset (blond)
  * [[`b225514e1c`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/b225514e1c)] - refactor(test): rename `harry-roberts` to `two-dashes` preset (blond)
  * [[`4f49550f46`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/4f49550f46)] - docs(toc): add toc to readme (blond)
  * [[`02c4094b59`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/02c4094b59)] - docs(install): add info about install (blond)
  * [[`5111759236`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/5111759236)] - docs(usage): add info about usage (blond)
  * [[`5b7b89770f`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/5b7b89770f)] - docs(view): update view of readme (blond)
  * [[`bf30206f03`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/bf30206f03)] - chore(package): update coveralls to version 2.11.9 (greenkeeperio-bot)
  * [[`a56e72f76d`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/a56e72f76d)] - docs(harry-roberts): update Convention by Harry Roberts (blond)
  * [[`da4497084b`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/da4497084b)] - docs(mod): add docs for mod option as object (blond)
  * [[`a05bf68d3c`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/a05bf68d3c)] - docs(modValDelim): add docs about `modValDelim` field (blond)
  * [[`a15ee5b7e9`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/a15ee5b7e9)] - docs(nbsp): use normal spaces (blond)
  * [[`6627261ccc`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/6627261ccc)] - test(presets): update `harry-roberts` cases (blond)
  * [[`d3e1ab464a`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/d3e1ab464a)] - test(modValDelim): add tests for modValDelim field (blond)
  * [[`326e375cd3`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/326e375cd3)] - test(options): add tests for options processing (blond)
  * [[`4c1c11e186`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/4c1c11e186)] - feat(modVal): support custom modifier separator (blond)
  * [[`c47b757340`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/c47b757340)] - test(fields): add tests for delim fields (blond)
  * [[`d5f5e92a7a`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/d5f5e92a7a)] - fix(fields): does not delim fields (blond)
  * [[`f512b06ee7`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/f512b06ee7)] - fix(jsdoc): fix `BemNaming` jsdoc (blond)
  * [[`9c0eab77cb`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/9c0eab77cb)] - fix(BemNaming): simplify initialization (blond)
  * [[`8750bc117b`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/8750bc117b)] - fix(options): remove deprecated options (blond)
  * [[`6e1a11de84`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/6e1a11de84)] - fix(BEMNaming): remove `BEMNaming` filed (blond)
  * [[`0b0f78a0a2`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/0b0f78a0a2)] - refactor(BemNaming): rename `BEMNaming` to `BemNaming` (blond)
  * [[`59637a038f`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/59637a038f)] - chore(package): update dependencies (greenkeeperio-bot)
  * [[`e08019ba81`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/e08019ba81)] - fix(namespace): should return namespace (blond)
  * [[`b0cd36c94b`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/b0cd36c94b)] - fix(stringify): should not throw error (blond)
  * [[`87187a46b3`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/87187a46b3)] - chore(cover): add coveralls (blond)
  * [[`2c5f0da71c`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/2c5f0da71c)] - chore(bower): update bower.json (blond)
  * [[`a29fbda2a0`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/a29fbda2a0)] - refactor(index): move index file (blond)
  * [[`f57a8f2a6c`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/f57a8f2a6c)] - refactor(strict): use strict mode (blond)
  * [[`a0eb1510ab`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/a0eb1510ab)] - chore(npm): update package.json (blond)
  * [[`3c5dbc9982`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/3c5dbc9982)] - test(coverage): fix coverage (blond)
  * [[`237f8def13`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/237f8def13)] - chore(npm): remove `.npmignore` file (blond)
  * [[`73a494dbf7`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/73a494dbf7)] - chore(test): use ava instead of mocha (blond)
  * [[`66fe215fb7`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/66fe215fb7)] - chore(lint): support ES 2015 (blond)
  * [[`41a45e5774`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/41a45e5774)] - chore(jscs): update jscs to 2.11.0 (blond)
  * [[`2afe2eb855`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/2afe2eb855)] - test(travis): run tests in NodeJS 4 and 5 (blond)
  * [[`5310cabc19`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/5310cabc19)] - style(lint): fix code for eslint (blond)
  * [[`b3768aed57`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/b3768aed57)] - chore(lint): use eslint instead of jshint (blond)
  * [[`58d6d46403`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/58d6d46403)] - chore(editorconfig): update .editorconfig (blond)
  * [[`95c474f682`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/95c474f682)] - chore(min): removed bem-naming.min.js (blond)
  * [[`562dda5d08`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/562dda5d08)] - docs(badges): updated badges (blond)
  * [[`32cc76799c`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/32cc76799c)] - chore(browsers): remove tests in browsers (blond)
  * [[`d1d5da419f`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/d1d5da419f)] - Fixed jshint config (andrewblond)
  * [[`3cdd0cb2db`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/3cdd0cb2db)] - Updated email (andrewblond)
  * [[`54ffa6cdf9`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/54ffa6cdf9)] - Fixed typos (andrewblond)
  * [[`cce496b844`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/cce496b844)] - Updated github username (andrewblond)
  * [[`de9e767abb`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/de9e767abb)] - Update shields secure http protocol (tavriaforever)
  * [[`2332b0da0f`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/2332b0da0f)] - **Docs**: fix spell whithin → within (Ludmila Sverbitckaya (Bot))
  * [[`27ad3c4d3f`](https://github.com/Andrew Abramov <mail@blond.im>/bem-naming/commit/27ad3c4d3f)] - **Docs**: fix spell in README.ru.md (Ludmila Sverbitckaya (Bot))

0.5.1
-----

* Добавлено кэширование при создании экземпляров класса `BEMNaming` (#53).
* Метод `stringify` ускорен в 2,5 раза (#57).
* Метод `parse` ускорен на 15% (#58).
* Метод `typeOf` ускорен в 2,25 раза (#59).

0.5.0
-----

* API: добавлены разделители (#48).

0.4.0
-----

* Упрощено API для создания собственных стилей именования сущностей (#37).
* Добавлен метод `typeOf` (#35).
* Добавлена поддержка `CamelCase` для оригинального стиля (#34).
* Добавлена лицензия.

0.3.0
-----

* Опция `elemSeparator` объявлена **deprecated**, вместо неё следует использовать `elem`.
* Опция `modSeparator` объявлена **deprecated**, вместо неё следует использовать `mod`.
* Опция `literal` объявлена **deprecated**, вместо неё следует использовать `wordPattern`.

0.2.1
-----

* Исправлен `package.json` файл.

0.2.0
-----

* Добавлена возможность представлять объект БЭМ-нотации без `modVal` поля.
* Добавлена минифицированная версия.
* Исправлена ошибка, при которой `is*` методы отрабатывали неверно, если на вход принимали невалидую строку.
* Исправлена ошибка с предоставлением `bemNaming` для ie6-8.

0.1.0
-----

* Добавлены следующие методы: `validate`, `isBlock`, `isElem`, `isBlockMod`, `isElemMod`.
* В сформированную строку не попадёт модификатор, если поле `modVal` объекта БЭМ-нотации равно `undefined`.
* Метод `stringify` вызывает ошибку, если на вход подан невалидный объект БЭМ-нотации.
* Метод `parse` возвращает объект БЭМ-нотации без излишних полей со значением `undefined`.
