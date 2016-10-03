'use strict';

const naming = require('bem-naming');

module.exports = function (decl) {
    const res = [];
    const hash = {};

    function add(entity) {
        const str = naming.stringify(entity);

        if (!hash[str]) {
            res.push({ entity: entity, tech: null });
        }

        hash[str] = true;
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
