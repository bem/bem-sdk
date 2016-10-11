# bem-walk

Инструмент для обхода файловой системы БЭМ-проекта.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Windows Status][appveyor-img]][appveyor]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/bem-walk
[npm-img]:      https://img.shields.io/npm/v/bem-walk.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-walk
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-walk.svg?label=tests

[appveyor]:     https://ci.appveyor.com/project/blond/bem-walk
[appveyor-img]: http://img.shields.io/appveyor/ci/blond/bem-walk.svg?style=flat&label=windows

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-walk
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-walk.svg

[david]:        https://david-dm.org/bem-sdk/bem-walk
[david-img]:    http://img.shields.io/david/bem-sdk/bem-walk.svg?style=flat

Возвращает следующую информацию о найденных файлах:

* тип БЭМ-сущности ([Блок](https://ru.bem.info/methodology/key-concepts/#Блок), [Элемент](https://ru.bem.info/methodology/key-concepts/#Элемент) или [Модификатор](https://ru.bem.info/methodology/key-concepts/#Модификатор));
* [технология реализации](https://ru.bem.info/methodology/key-concepts/#Технология-реализации);
* расположение на файловой системе.

## Быстрый старт

**Примечание** Для работы с `bem-walk` требуется установить Node.js 4.0+.

### 1. Установите bem-walk

```
$ npm install --save bem-walk
```

### 2. Подключите bem-walk

Создайте JavaScript-файл с произвольным именем и добавьте строку следующего вида:

```js
const walk = require('bem-walk');
```

**Примечание** Созданный JavaScript-файл будет использоваться для всех последующих шагов.

### 3. Опишите уровни файловой системы

Опишите уровни файловой системы проекта в объекте `config`.

```js
const config = {
    // уровни проекта
    levels: {
        'lib/bem-core/common.blocks': {
            // `naming` — схема именования файлов
            naming: 'two-dashes'
        },
        'common.blocks': {
            // `scheme` — схема файловой системы
            scheme: 'nested'
        }
    }
};
```

Для каждого уровня указывается схема именования файлов либо организации файловой системы. Это позволяет при обходе получать информацию о БЭМ-сущностях [по их именам](https://ru.bem.info/toolbox/sdk/bem-naming/#Строковое-представление) или по именам файлов и директорий.

Описание возможных значений, которые можно задать для каждой из схем, представлено в таблице.

| Ключ | Схема | Значение по умолчанию | Возможные значения |
|----|------|-----|----------|
| `naming` | Именования файлов.|`origin`| `origin`, `two-dashes`|
| `scheme` | Файловой системы.|`nested`|`nested`, `flat`|

Подробнее:
* [bem-naming](https://ru.bem.info/toolbox/sdk/bem-naming/)
* [bem-fs-scheme](https://ru.bem.info/toolbox/sdk/bem-fs-scheme/)

**Примечание** Чтобы не определять уровни проекта вручную, воспользуйтесь инструментом [`bem-config`](https://ru.bem.info/toolbox/sdk/bem-config/).

```js
const config = require('bem-config')();
const levelMap = config.levelMapSync();
const stream = walk(levels, levelMap);
```

### 4. Опишите пути обхода

Укажите пути обхода в объекте `levels`.

Возможные варианты:

* Относительно корневого каталога.

  ```js
  const levels = [
      'libs/bem-core/common.blocks',
      'common.blocks'
  ];
  ```

* Абсолютные.

  ```js
  const levels = [
      '/path/to/project/lib/bem-core/common.blocks',
      '/path/to/project/common.blocks'
  ];
  ```

### 5. Получите информацию о найденных файлах

Передайте методу walk() объекты `levels` и `config`.

Для получения данных о найденных файлах используется поток (stream). Когда порция данных получена, генерируется событие `data` и [информация о найденном файле](#Выходные-данные) добавляется в массив `files`. При возникновении ошибки `bem-walk` прекращает обработку запроса и возвращает ответ, содержащий идентификатор ошибки и ее описание. Событие `end` наступает при окончании получения данных из потока.

```js
const files = [];

const stream = walk(levels, config);
// добавляем информацию о найденном файле в конец массива files
stream.on('data', file => files.push(file));

stream.on('error', console.error);

stream.on('end', () => console.log(files));
```
### Полный код примера

В результате выполненных действий полный код JavaScript-файла должен иметь следующий вид:

```js
const walk = require('bem-walk');
const config = require('bem-config')();
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];
const files = [];

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .on('data', file => files.push(file))
    .on('error', console.error)
    .on('end', () => console.log(files));
```

**Примечание** В примере используется пакет `bem-config`.

## API

### Метод walk

`walk(levels, config);`

#### Описание

Обходит директории описанные в параметре `levels` и возвращает поток `stream.Readable`.

#### Входные параметры

Требования к поиску определяются параметрами `levels` и `config`.

| Параметр | Тип | Описание |
|----------|-----|----------|
|**levels**|`string[]`|Пути обхода|
|**config**|`object`|Уровни проекта|

#### Выходные данные

Поток с возможностью чтения (`stream.Readable`), который имеет следующие события:

| Событие | Описание |
|----------|-----|
|'data'|Возвращается JavaScript-объект с информацией о найденном файле. </br></br> Ниже рассмотрен JSON-интерфейс, включающий элементы, которые входят в ответ метода `walk`. Объекты и ключи приведены с примерами значений. </br></br> **Пример** </br></br><code>{</code></br><code>"entity": { "block": "page" },</code></br><code>"level": "libs/bem-core/desktop.blocks",</code></br><code>"tech": "bemhtml",</code></br><code>"path": "libs/bem-core/desktop.blocks/page/page.bemhtml.js"</code></br><code>}</code></br></br>`entity` — БЭМ-сущность;</br> `level` — путь к директории;</br> `tech` — технология реализации;</br> `path` — относительный путь к файлу.|
| 'error' | Генерируется, если при обходе уровней произошла ошибка. Возвращается объект с описанием ошибки.|
| 'end' | Генерируется, когда `bem-walk` заканчивает обход уровней, описанных в объекте `levels`. |

## Примеры использования

Типовые задачи, решаемые с полученными JavaScript-объектами:
* [Группировка](#Группировка)
* [Фильтрация](#Фильтрация)
* [Трансформация имеющихся данных](#Трансформация)

### Группировка

> Группируем найденные файлы по имени блока.

```js
const walk = require('bem-walk');
const config = require('bem-config')();
const util = require('util');
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];
const groups = {};

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .on('data', file => {
        // Получаем имя блока для найденного файла.
        const block = file.entity.block;

        // Добавляем информацию о найденном файле.
        (groups[block] = []).push(file);
    })
    .on('error', console.error)
    .on('end', () => console.log(util.inspect(groups, {
        depth: null
    })));

/*
{ button:
   [ { entity: { block: 'button', modName: 'togglable', modVal: 'radio' },
       tech: 'spec.js',
       path: 'libs/bem-components/common.blocks/button/_togglable/
       button_togglable_radio.spec.js',
       level: 'libs/bem-components/common.blocks' } ],
 ...
}
*/
```

### Фильтрация

> Находим файлы блока `popup`.

```js
const walk = require('bem-walk');
const config = require('bem-config')();
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];
const files = [];

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .on('data', file => {
        // Получаем имя блока для найденного файла.
        const block = file.entity.block;

        // Добавляем информацию о найденном файле.
        if (block == 'popup') {
            files.push(file);
        }
    })
    .on('error', console.error)
    .on('end', () => console.log(files));

/*
[{ entity: { block: 'popup', modName: 'target', modVal: true },
   tech: 'js',
   path: 'libs/bem-components/common.blocks/popup/_target/popup_target.js',
   level: 'libs/bem-components/common.blocks' },
...
]
*/
```

### Трансформация

> Находим БЭМ-файлы, читаем их содержимое и создаем новое свойство `source`.

```js
const fs = require('fs');
const walk = require('bem-walk');
const config = require('bem-config')();
const stringify = require('JSONStream').stringify;
const through2 = require('through2');
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .pipe(through2.obj(function(file, enc, callback) {
        try {
            // Некоторые технологии (например, `i18n`) могут быть директориями, а не файлами.
            if (fs.statSync(file.path).isFile()) {
                // Записываем содержимое файла в поле `source`.
                file.source = fs.readFileSync(file.path, 'utf-8');
                this.push(file);
            }

        } catch (err) {
            callback(err);
        }
    }))
    .pipe(stringify())
    .pipe(process.stdout);
    
/*
[{"entity":{"block":"search","elem":"header"},
  "tech":"css",
  "path":"common.blocks/search/__header/search__header.css",
  "level":"common.blocks",
  "source":".search__header {\n\tdisplay: block;\n\tfont-size: 20px;\n\tcolor:
  rgba(0,0,0,0.84);\n\tmargin: 0;\n\tpadding: 0 0 16px;\n\n}\n\n"},
...
]
*/
```
