# @bem/sdk

<div align="center">
    <img width="300" height="300" src="https://rawgithub.com/bem/bem-sdk/master/logo.svg" alt="logo" />
</div>

Модули для работы по [БЭМ][]-методологии.

## Общие

* [@bem/sdk.walk](https://github.com/bem/bem-sdk/tree/master/packages/walk) — получение интроспекции БЭМ-проекта
* [@bem/sdk.config](https://github.com/bem/bem-sdk/tree/master/packages/config) — работа с конфигурационными файлами в БЭМ-проектах

## Именование

* [@bem/sdk.naming.entity](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity) — старый добрый знаменитый пакет `bem-naming`. Содержит методы `parse` и `stringify` (DEPREACTED, используйте отдельные пакеты)
* [@bem/sdk.naming.entity.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.stringify) — преобразовать к строке представление [БЭМ-сущности](entity)
* [@bem/sdk.naming.entity.parse](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse) — разобрать из строки представление [БЭМ-сущности](entity)
* [@bem/sdk.naming.cell.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.cell.stringify) — преобразователь к строке пути до [БЭМ-сущности](entity) в учетом схемы уровня
* [@bem/sdk.naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) — набор широко известных настроек для `naming.*` пакетов

## Декларации

* [@bem/sdk.decl](https://github.com/bem/bem-sdk/tree/master/packages/decl) — работа с группами [БЭМ-сущностей](entity), нахождение их пересечения, объединения, вычитания...
* [@bem/sdk.bemjson-to-decl](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-decl) – вычленение декларации из [bemjson][]-структуры
* [@bem/sdk.bemjson-to-jsx](https://github.com/bem/bem-sdk/tree/master/packages/bemjson-to-jsx) – трансформация [bemjson] в [JSX][]-разметку
* [@bem/sdk.import-notation](https://github.com/bem/bem-sdk/tree/master/packages/import-notation) — вычленение декларации из строк в формате `es6-import` и `require`

## Зависимости

* [@bem/sdk.graph](https://github.com/bem/bem-sdk/tree/master/packages/graph) — работа с графом зависимостей
* [@bem/sdk.deps](https://github.com/bem/bem-sdk/tree/master/packages/deps) — высокоуровневый инструмент для работы с зависимостями между [БЭМ-сущностями](entity)

## Контейнеры

* [@bem/sdk.entity-name](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) — представление [БЭМ-сущности](entity)
* [@bem/sdk.cell](https://github.com/bem/bem-sdk/tree/master/packages/cell) — [БЭМ-сущность](entity) с технологией и слоем
* [@bem/sdk.bundle](https://github.com/bem/bem-sdk/tree/master/packages/bundle) — представление БЭМ-бандла

[БЭМ]: https://ru.bem.info
[entity]: https://ru.bem.info/methodology/key-concepts/#БЭМ-сущность
[bemjson]: https://ru.bem.info/platform/bemjson/
[JSX]: https://facebook.github.io/react/docs/introducing-jsx.html
