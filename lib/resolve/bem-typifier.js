import { stringify as stringifyEntity } from 'bem-naming';
import { typeOf as entityType } from 'bem-naming';

export default class BemTypifier {
    constructor() {
        this._entityMap = new Map();

        this._typedIds = {
            block: new Set(),
            blockMod: new Set(),

            elem: new Set(),
            elemMod: new Set()
        };
    }
    typify(entity) {
        var id = stringifyEntity(entity),
            type = entityType(entity);

        this._entityMap.set(id, entity);
        this._typedIds[type].add(id);
    }
    blocks() {
        return this._entitiesByType('block');
    }
    blockModificators() {
        return this._entitiesByType('blockMod');
    }
    elements() {
        return this._entitiesByType('elem');
    }
    elementModificators() {
        return this._entitiesByType('elemMod');
    }
    _entitiesByType(type) {
        var entityMap = this._entityMap,
            iterator = this._typedIds[type].values();

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
