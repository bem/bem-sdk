'use strict';

const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

function getMods(entity) {
    let mods = entity.mods;
    let modName = entity.modName;

    if (modName) {
        mods = {};

        mods[modName] = entity.modVal || true;
    }

    if (!mods) {
        return;
    }

    if (!Array.isArray(mods)) {
        return mods;
    }

    const res = {};

    for (let i = 0; i < mods.length; ++i) {
        modName = mods[i];

        res[modName] = true;
    }

    return res;
}

module.exports = function (decl) {
    const res = [];
    const hash = {};

    function add(rawEntity) {
        const entity = new BemEntityName(rawEntity);
        if (hash[entity.id]) {
            return;
        }
        hash[entity.id] = true;
        res.push(new BemCell({
            entity: entity,
            tech: null
        }));
    }

    if (!decl) { return []; }
    if (!Array.isArray(decl)) { decl = [decl]; }

    for (let i = 0; i < decl.length; ++i) {
        const entity = decl[i];
        let block, mods, elems;

        if (typeof entity === 'string') {
            block = entity;
        } else {
            block = entity.block;
            mods = getMods(entity);
            elems = entity.elems ? entity.elems : entity.elem && [{ elem: entity.elem, mods: mods }];
        }

        if (block) {
            add({ block: block });
        } else {
            const scope = entity.scope;

            if (typeof scope === 'object') {
                block = scope.block;

                if (scope.elem) {
                    normalizeMods(block, scope.elem, mods);
                    break;
                }
            } else {
                block = scope;
            }
        }

        if (elems) {
            for (let j = 0; j < elems.length; ++j) {
                const elem = elems[j];

                if (typeof elem === 'string') {
                    add({ block: block, elem: elem });
                } else {
                    const elemName = elem.elem;
                    const elemMods = getMods(elem);

                    add({ block: block, elem: elemName });

                    if (elemMods) {
                        normalizeMods(block, elemName, elemMods);
                    }
                }
            }
        }

        if (!entity.elem && mods) {
            normalizeMods(block, null, mods);
        }
    }

    function normalizeMods(block, elem, mods) {
        const modNames = Object.keys(mods);

        for (var i = 0; i < modNames.length; ++i) {
            const modName = modNames[i];
            let modVals = mods[modName];

            if (typeof modVals !== 'object') {
                modVals = [modVals];
            }

            for (let j = 0; j < modVals.length; ++j) {
                const resItem = { block: block };
                elem && (resItem.elem = elem);
                resItem.mod = { name: modName, val: modVals[j] };
                add(resItem);
            }
        }
    }

    return res;
};
