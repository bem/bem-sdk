bem-naming
==========

[![NPM version](http://img.shields.io/npm/v/bem-naming.svg?style=flat)](http://www.npmjs.org/package/bem-naming) [![Download](http://img.shields.io/badge/download-1%20kB-blue.svg?style=flat)](https://github.com/bem/bem-naming/releases/v0.3.0) [![Build Status](http://img.shields.io/travis/bem/bem-naming/master.svg?style=flat)](https://travis-ci.org/bem/bem-naming) [![Coverage Status](https://img.shields.io/coveralls/bem/bem-naming.svg?branch=master&style=flat)](https://coveralls.io/r/bem/bem-naming) [![devDependency Status](http://img.shields.io/david/dev/bem/bem-naming.svg?style=flat)](https://david-dm.org/bem/bem-naming#info=devDependencies)

Что это?
--------

Инструмет позволяет получать информацию о БЭМ-сущности по [строке](#%D0%A1%D1%82%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%D0%BE%D0%B5-%D0%BF%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5), а так же формировать строковое представление на основе [БЭМ-нотации](#%D0%91%D0%AD%D0%9C-%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F).

Строковое представление
-----------------------
Для обозначения БЭМ-сущностей зачастую используется специальный формат строки, по которой можно однозначно определить, какая именно сущность представлена.

В оригинальном стиле такая строка будет выглядить следующим образом:

```js
'block[_block-mod-name[_block-mod-val]][__elem-name[_elem-mod-name[_elem-mod-val]]]'
```

*(В квадратных скобках необязательные параметры)*

* Блок — `block-name`.
* Модификатор блока в формате ключ-значение — `block-name_mod-name_mod-val`.
* Булевый модификатор блока — `block-name_mod`.
* Элемент блока — `block-name__elem-name`.
* Модификатор элемента в формате ключ-значение — `block-name__elem-name_mod-name_mod-val`.
* Булевый модификатор элемента — `block-name__elem_mod`.

Частые заблуждения
------------------

БЭМ-методология предполагает использование плоской структуры внутри блока, это означает, что БЭМ-сущность не может быть представлена как элемент элемента, и следующее строковое предстовление будет невалидным:

```js
'block__some-elem__sub-elem'
```

Также не бывает такой БЭМ-сущности, как модификатор блока и модификатор элемента одновременнно, поэтому следующее строковое предстовление будет невалидным:

```js
'block_block-mod-name_block-mod-val__elem-name_elem-mod-name_elem-mod-val'
```

БЭМ-нотация
-----------

Также БЭМ-сущность можно обозначить с помощью js-объекта со следующими полями:

* `block` — имя блока. Обязательное поле, т.к. не может существовать никакой самостоятельной БЭМ-сущности, кроме блока.
* `elem` — имя элемента.
* `modName` — название модификатора.
* `modVal` — значение модификатора.

Модификатор состоит из пары `modName` и `modVal`. Это означает, что поле `modVal` без `modName` не имеет никакого смысла.

Пример:

```js
// Модификатор блока
{
    block: 'block',
    modName: 'mod',
    modVal: 'val'
}

// Невалидная БЭМ-нотация
{
    block: 'block',
    modVal: 'val'
}
```

Чтобы задать булевый модификатор поле `modVal` должно быть указано со значением `true`. В таком случае отображаться будет только имя модификатора.

Пример:

```js
// Булевый модификатор блока
{
    block: 'block',
    modName: 'mod',
    modVal: true
}

// Сокращенная запись булевого модификатора блока
{
    block: 'block',
    modName: 'mod'
}

// Невалидная БЭМ-нотация
{
    block: 'block',
    modName: 'mod',
    modVal: false
}
```

API
---

* [`validate(str)`](#validatestr)
* [`parse(str)`](#parsestr)
* [`stringify(obj)`](#stringifyobj)
* [`typeOf(str)`](#typeofstr)
* [`typeOf(obj)`](#typeofobj)
* [`isBlock(str)`](#isblockstr)
* [`isBlock(obj)`](#isblockobj)
* [`isBlockMod(str)`](#isblockmodstr)
* [`isBlockMod(obj)`](#isblockmodobj)
* [`isElem(str)`](#iselemstr)
* [`isElem(obj)`](#iselemobj)
* [`isElemMod(str)`](#iselemmodstr)
* [`isElemMod(obj)`](#iselemmodobj)

### `validate(str)`

Проверяет может ли строка `str` быть раскрыта в БЭМ-нотацию.

Пример:

```js
bemNaming.validate('block-name');  // true
bemNaming.validate('^*^');         // false
```

<hr/>

### `parse(str)`

Раскрывает строку `str` в БЭМ-нотацию.

Пример:

```js
bemNaming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                         //   modName: 'mod', modVal: 'val' }
```

<hr/>

### `stringify(obj)`

Формирует строку по БЭМ-нотации `obj`.

Пример:

```js
bemNaming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

<hr/>

### `typeOf(str)`

Возвращает строку, указывающую тип БЭМ-сущности.

Пример:

```js
bemNaming.typeOf('block');             // block
bemNaming.typeOf('block_mod');         // blockMod
bemNaming.typeOf('block__elem');       // elem
bemNaming.typeOf('block__elem_mod');   // elemMod
```

<hr/>

### `typeOf(obj)`

Возвращает строку, указывающую тип БЭМ-сущности.

Пример:

```js
bemNaming.isBlock({ block: 'block' });                 // block
bemNaming.isBlock({ block: 'block', modName: 'mod' }); // blockMod
bemNaming.isBlock({ block: 'block', elem: 'elem' });   // elem
bemNaming.isBlock({ block: 'block', elem: 'elem' });   // elemMod
```

<hr/>

### `isBlock(str)`

Проверяет обозначает ли строка `str` блок.

Пример:

```js
bemNaming.isBlock('block-name');   // true
bemNaming.isBlock('block__elem');  // false
```

<hr/>

### `isBlock(obj)`

Проверяет обозначает ли БЭМ-нотация `obj` блок.

Пример:

```js
bemNaming.isBlock({ block: 'block-name' });           // true
bemNaming.isBlock({ block: 'block', elem: 'elem' });  // false
```

<hr/>

### `isBlockMod(str)`

Проверяет обозначает ли строка `str` модификатор блока.

Пример:

```js
bemNaming.isBlockMod('block_mod');        // true
bemNaming.isBlockMod('block__elem_mod');  // false
```

<hr/>

### `isBlockMod(obj)`

Проверяет обозначает ли БЭМ-нотация `obj` модификатор блока.

Пример:

```js
bemNaming.isBlockMod({ block: 'block',
    modName: 'mod', modVal: true });  // true

bemNaming.isBlockMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // false
```

<hr/>

### `isElem(str)`

Проверяет обозначает ли строка `str` элемент блока.

Пример:

```js
bemNaming.isElem('block__elem');  // true
bemNaming.isElem('block-name');   // false
```

<hr/>

### `isElem(obj)`

Проверяет обозначает ли БЭМ-нотация `obj` элемент блока.

Пример:

```js
bemNaming.isElem({ block: 'block', elem: 'elem' });  // true
bemNaming.isElem({ block: 'block-name' });           // false
```

<hr/>

### `isElemMod(str)`

Проверяет обозначает ли строка `str` модификатор элемента.

Пример:

```js
bemNaming.isElemMod('block__elem_mod');  // true
bemNaming.isElemMod('block__elem');      // false
```

<hr/>

### `isElemMod(obj)`

Проверяет обозначает ли БЭМ-нотация `obj` модификатор элемента.

Пример:

```js
bemNaming.isElemMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // true

bemNaming.isElemMod({ block: 'block',
    modName: 'mod', modVal: true});   // false
```

Собственный стиль
-----------------

Используйте функцию `bemNaming`, чтобы создать новый объект для работы в вашем собственном стиле.

Функция принимает объект из следующих опций:

* **String** `elem` — отделяет имя элемента от блока. По&nbsp;умолчанию&nbsp;—&nbsp;`__`.
* **String** `mod` — отделяет названия и значения модификаторов от блоков и элементов. По&nbsp;умолчанию&nbsp;—&nbsp;`_`.
* **String** `wordPattern` — определяет, какие символы могут быть использованы в именах блоков, элементов и модификаторов. По умолчанию&nbsp;—&nbsp;`[a-z0-9]+(?:-[a-z0-9]+)*`.

Пример:

```js
var myNaming = bemNaming({
    elem: '-',
    mod: '--',
    wordPattern: '[a-zA-Z0-9]+'   // т.к. сепараторы элемента и модификаотра включают
});                               // в себя дефис, исключим его из имён блоков,
                                  // элементов и модификаторов

myNaming.parse('block--mod');     // { block: 'block',
                                  //   modName: 'mod', modVal: true }

myNaming.stringify({              // 'blockName-elemName--boolElemMod'
    block: 'blockName',
    elem: 'elemName',
    modName: 'boolElemMod'
});
```

В стиле Гарри Робертса
----------------------

Согласно этому соглашению элементы отделяются от&nbsp;блока с&nbsp;помошью двух символов подчёркивания (__), а&nbsp;булевые модификаторы с&nbsp;помощью двух символов дефиса (--). Модификаторы вида ключ-значение не&nbsp;используются.

Подробнее читайте в [руководстве](http://cssguidelin.es/#bem-like-naming).

Пример:

```js
var csswizardry = bemNaming({
    elem: '__',
    mod: '--'
});

csswizardry.parse('block__elem'); // { block: 'block', elem: 'elem' }
csswizardry.parse('block--mod');  // { block: 'block',
                                  //   modName: 'mod', modVal: true }

csswizardry.stringify({           // 'block__elem--mod'
    block: 'block',
    elem: 'elem',
    modName: 'mod'
});
```

Лицензия
--------

© 2014 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
