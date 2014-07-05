bem-naming
==========

[![Bower version](https://badge.fury.io/bo/bem-naming.svg)](http://badge.fury.io/bo/bem-naming) [![NPM version](https://badge.fury.io/js/bem-naming.svg)](http://badge.fury.io/js/bem-naming) [![Build Status](https://travis-ci.org/bem/bem-naming.svg)](https://travis-ci.org/bem/bem-naming) [![Coverage Status](https://img.shields.io/coveralls/bem/bem-naming.svg?branch=master)](https://coveralls.io/r/bem/bem-naming) [![devDependency Status](https://david-dm.org/bem/bem-naming/dev-status.svg)](https://david-dm.org/bem/bem-naming#info=devDependencies)

Что это?
--------

Инструмет позволяет получать информацию о БЭМ-сущности по [строке](#%D0%A1%D1%82%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%D0%BE%D0%B5-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5), а так же формировать строковое представление на основе [БЭМ-нотации](#%D0%91%D0%AD%D0%9C-%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F).

Строковое представление
-----------------------
Для обозначения БЭМ-сущностей зачастую используется специальный формат строки, по которой можно однозначно определить, какая именно сущность представлена.

В оригинальном стиле такая строка будет выглядить следующим образом:

```js
'block[_blockModName[_blockModVal]][__elemName[_elemModName[_elemModVal]]]'
```

*(В квадратных скобках необязательные параметры)*

* Блок — `block-name`.
* Модификатор блока в формате ключ-значение — `block-name_mod-name_mod-val`.
* Булевый модификатор блока — `block-name_mod`.
* Элемент блока — `block-name__elem-name`.
* Модификатор элемента в формате ключ-значение — `block-name__elem-name_mod-name_mod-val`.
* Булевый модификатор элемента — `block-name__elem_mod`.

БЭМ-нотация
-----------

Также БЭМ-сущность можно обозначить с помощью js-объекта со следующими полями:

* `block` — имя блока. Обязательное поле, т.к. не может существовать никакой самостоятельной БЭМ-сущности, кроме блока.
* `elem` — имя элемента.
* `modName` — название модификатора.
* `modVal` — значение модификатора.

API
---

* [`parse(str)`](#parsestr)
* [`stringify(obj)`](#stringifyobj)

### `parse(str)`

* **String** `str` — строка, определяющая БЭМ-сущность.

Раскрывает строку `str` в [БЭМ-нотацию](#%D0%91%D0%AD%D0%9C-%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F).

Пример:

```js
var naming = require('bem-naming');

naming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                      //   modName: 'mod', modVal: 'val' }
```

<hr/>

### `stringify(obj)`

* **String** `obj` — хэш-объект (БЭМ-нотация), определяющий БЭМ-сущность.

Формирует строку по [БЭМ-нотации](#%D0%91%D0%AD%D0%9C-%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F) `obj`.

Пример:

```js
var naming = require('bem-naming');

naming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

Собственный стиль
-----------------

Чтобы использовать собственный стиль для описания строк, представляющих БЭМ-сущности, потребуется создать инстанс `BEMNaming`-класса.

Конструктор `BEMNaming` принимает объект из следующих опций:

* **String** `modSeparator` — отделяет названия и значения модификаторов от блоков и элементов. По&nbsp;умолчанию&nbsp;—&nbsp;`_`.
* **String** `elemSeparator` — отделяет имя элемента от блока. По&nbsp;умолчанию&nbsp;—&nbsp;`__`.
* **String** `literal` — определяет, какие символы могут быть использованы в именах блоков, элементов и модификаторов. По умолчанию&nbsp;—&nbsp;`[a-zA-Z0-9-]`.

Пример:

```js
var BEMNaming = require('bem-naming').BEMNaming;
var naming = new BEMNaming({
    elemSeparator: '-',
    modSeparator: '--',
    literal: '[a-zA-Z0-9]'      // т.к. сепараторы элемента и модификаотра включают
});                             // в себя дефис, исключим его из имён блоков,
                                // элементов и модификаторов

naming.parse('block--mod');     // { block: 'block',
                                //   modName: 'modFixed', modVal: true }

naming.stringify({              // 'blockName-elemName--boolElemMod'
    block: 'blockName',
    elem: 'elemName',
    modName: 'boolElemMod'
});
```

