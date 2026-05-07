# Changesets

Используется для управления версиями и публикации пакетов в монорепо.

## Как добавить запись

```sh
pnpm changeset
```

Команда задаст вопросы про затронутые пакеты, тип bump (major/minor/patch) и описание.

## Как выпустить релиз

```sh
pnpm version    # bump версий по changeset-файлам
pnpm release    # build + publish в npm
```
