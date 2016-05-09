import { stringify as stringifyEntity } from 'bem-naming';
import { parse as parseId }  from 'bem-naming';
import DependencyError from './dependency-error';

export default class DependencyGraph {
    constructor() {
        this._entityMap = new Map();
        this._dependencyMap = new Map();
        this._orderedDependencyMap = new Map();
        this._unorderedDependencyMap = new Map();
    }
    addDependency(fromEntity, toEntity, params={}) {
        var fromId = stringifyEntity(fromEntity),
            toId = stringifyEntity(toEntity);

        this._entityMap.set(fromId, fromEntity);
        fromEntity.id = fromId; // TODO: fixme
        this._entityMap.set(toId, toEntity);
        toEntity.id = toId;

        var map = params.order ? this._orderedDependencyMap : this._unorderedDependencyMap;

        if (!map.has(fromId)) {
            map.set(fromId, new Set());
        }

        map.get(fromId).add(toId);
    }
    entities() {
        return this._entityMap.values();
    }
    entitiesFrom(startEntity) {
        var graph = this,
            entityMap = this._entityMap,
            visitedIds = new Set();

        return {
            [Symbol.iterator]: function * () {
                function* step(track) {
                    var previousId = track[track.length - 1];

                    if (visitedIds.has(previousId)) return;

                    visitedIds.add(previousId);

                    var orderedDependencies = graph._orderedDependencyMap.get(previousId) || new Set().values(),
                        unorderedDependencies = graph._unorderedDependencyMap.get(previousId) || new Set().values();

                    for (let id of orderedDependencies) {
                        // игнорируем зависимость самого на себя
                        if (previousId === id) continue;

                        // проверяем нет ли циклической ordered-зависимости
                        var loopFirstIndex = track.indexOf(id);
                        if (loopFirstIndex !== -1) {
                            // добавляем в цепь замыкающую сущность
                            track.push(id);
                            // формируем цепь для ошибки
                            var errorInfo = track.slice(loopFirstIndex).map(errorObject);
                            throw new DependencyError(errorInfo);
                        }

                        yield [entityMap.get(id), true, previousId];

                        yield* step(track.concat(id));
                    }

                    function errorObject(key) {
                        return {
                            entity: parseId(key)
                        };
                    }

                    for (let id of unorderedDependencies) {
                        // игнорируем зависимость самого на себя
                        if (previousId === id) continue;

                        yield [entityMap.get(id), undefined, previousId];

                        yield* step([id]);
                    }
                }

                var startId = stringifyEntity(startEntity);

                yield* step([startId]);
            }
        };
    }
    dependenciesOf(entity) {
        var id = stringifyEntity(entity);

        var entityMap = this._entityMap,
            orderedSet = this._orderedDependencyMap.get(id),
            unorderedSet = this._unorderedDependencyMap.get(id);

        if (!orderedSet && !unorderedSet) return new Set().values();

        var orderedIterator = orderedSet && orderedSet.values(),
            unorderedIterator = unorderedSet && unorderedSet.values();

        return {
            [Symbol.iterator]: function () {
                return this;
            },
            next: function () {
                var item = this._iterator.next(),
                    isDone = item.done;

                if (isDone && this._iterator === orderedIterator) {
                    this._iterator = unorderedIterator;
                }

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            },
            _iterator: orderedIterator || unorderedIterator
        };
    }
    orderedDependenciesOf(entity) {
        return this._dependenciesOfFromMap(entity, this._orderedDependencyMap);
    }
    unorderedDependenciesOf(entity) {
        return this._dependenciesOfFromMap(entity, this._unorderedDependencyMap);
    }
    _dependenciesOfFromMap(entity, map) {
        var id = stringifyEntity(entity);

        var entityMap = this._entityMap,
            dependenceEntities = map.get(id);

        if (!dependenceEntities) return new Set().values();

        var iterator = dependenceEntities.values();

        return {
            [Symbol.iterator]: function () {
                return this;
            },
            next: function () {
                var item = iterator.next();

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            }
        };
    }
}
