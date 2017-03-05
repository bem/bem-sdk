bem-sdk
=======

<div align="center">
    <img width="300" height="300" src="https://bem-sdk.github.io/bem-sdk/logo.svg" alt="logo" />
</div>

Модули для работы по [БЭМ]-методологии:

общие:

* [bem-walk](https://github.com/bem-sdk/bem-walk) — получение интроспекции БЭМ-проекта
* [bem-config](https://github.com/bem-sdk/bem-config) — работа с конфигурационными файлами в БЭМ-проектах

именование:

* [bem-naming](https://github.com/bem-sdk/bem-naming) — работа со строковым представлением [БЭМ-сущностей]
* [bem-fs-scheme](https://github.com/bem-sdk/bem-fs-scheme) — поиск соответствия путей на диске с [БЭМ-сущностями] с учетом схемы БЭМ-проекта

декларации:

* [bem-decl](https://github.com/bem-sdk/bem-decl) — работа с группами [БЭМ-сущностей](БЭМ-сущность), нахождение их пересечения, объединения, вычитания...
* [bemjson-to-decl](https://github.com/bem-sdk/bemjson-to-decl) – вычленение декларации из [bemjson]-структуры
* [bem-import-notation](https://github.com/bem-sdk/bem-import-notation) — вычленение декларации из строк в формате `es6-import` и `require`

зависимости:

* [bem-graph](https://github.com/bem-sdk/bem-graph) — работа с графом зависимостей
* [bem-deps](https://github.com/bem-sdk/bem-deps) — высокоуровневый инструмент для работы с зависимостями между БЭМ-сущностями

контейнеры:

* [bem-entity-name](https://github.com/bem-sdk/bem-entity-name) — представление [БЭМ-сущность] name representation
* [bem-cell](https://github.com/bem-sdk/bem-cell) — [БЭМ-сущность] с технологией и слоем
* [bem-bundle](https://github.com/bem-sdk/bem-bundle) — представление БЭМ-бандла

[БЭМ]: https://ru.bem.info
[БЭМ-сущность]: https://ru.bem.info/methodology/key-concepts/#БЭМ-сущность
[bemjson]: https://ru.bem.info/platform/bemjson/

