'use strict';

const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

module.exports = function (decl) {
    const res = [];
    const hash = {};

    function add(rawEntity) {
        const entity = new BemEntityName(rawEntity);
        const id = entity.id;

        if (hash[id]) {
            return;
        }

        hash[id] = true;
        res.push(new BemCell({ entity }));
    }

    if (!decl) { return []; }
    if (!Array.isArray(decl)) { decl = [decl]; }

    for (let i = 0; i < decl.length; ++i) {
        const entity = decl[i];
        const block = entity.name;
        const mods = entity.mods;
        const elems = entity.elems;

        add({ block: block });

        if (mods) {
            normalizeMods(block, mods);
        }

        if (elems) {
            for (let j = 0; j < elems.length; ++j) {
                const elem = elems[j];
                const elemName = elem.name;
                const elemMods = elem.mods;

                add({ block: block, elem: elemName });

                if (elemMods) {
                    normalizeMods(block, elemName, elemMods);
                }
            }
        }
    }

    function normalizeMods(block, elem, mods) {
        const isElem = arguments.length === 3;

        if (!isElem) {
            mods = elem;
        }

        for (let i = 0; i < mods.length; ++i) {
            const mod = mods[i];
            const vals = mod.vals;
            const hasVals = vals && vals.length;

            let resItem;
            let j = 0;

            do {
                resItem = {
                    block: block,
                    modName: mod.name,
                    modVal: hasVals ? vals[j].name : true
                };

                isElem && (resItem.elem = elem);

                add(resItem);
                ++j;
            } while (j < hasVals);
        }
    }

    return res;
};
