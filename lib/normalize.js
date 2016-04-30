'use strict';

const naming = require('bem-naming');

module.exports = function (decl) {
    const res = [];
    const hash = {};

    function add(entity) {
        const str = naming.stringify(entity);

        if (!hash[str]) {
            res.push(entity);
        }

        hash[str] = true;
    }

    if (!decl) { return []; }
    if (!Array.isArray(decl)) { decl = [decl]; }

    for (var i = 0; i < decl.length; ++i) {
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
            const l = vals && vals.length;

            let resItem;

            if (l) {
                for (let j = 0; j < l; ++j) {
                    resItem = {
                        block: block,
                        modName: mod.name, modVal: vals[j].name
                    };

                    isElem && (resItem.elem = elem);

                    add(resItem);
                }
            } else {
                resItem = {
                    block: block,
                    modName: mod.name, modVal: true
                };

                isElem && (resItem.elem = elem);

                add(resItem);
            }
        }
    }

    return res;
};
