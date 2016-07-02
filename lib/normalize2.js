'use strict';

const naming = require('bem-naming');

module.exports = function (decl) {
    const res = [];
    const hash = {};

    if (!decl) { return res; }

    if (typeof decl === 'string' || !(Symbol.iterator in decl)) {
        decl = [decl];
    }

    for (let entity of decl) {
        let block, mod, mods, elem, elems, tech;

        if (typeof entity === 'string') {
            block = entity;
        } else {
            block = entity.block;
            elem = entity.elem;
            elems = entity.elems;
            mod = getMod(entity);
            mods = getMods(entity);
            tech = entity.tech;
        }

        if (block) {
            let elemsOrMods = elems || !isNotActual(mods);
            let noOther = !elems && !elem && isNotActual(mods) && isNotActual(mod);

            if (elemsOrMods || noOther) {
                add({ block: block }, tech);
            }

            if (!isNotActual(mod) && !elem) {
                processMods({ block, mods: mod, tech });
            }
        }

        if (elem) {
            if (!Array.isArray(elem)) {
                elem = [elem];
            }
            for (let elItem of elem) {
                if (typeof elItem === 'string') {
                    add({ block: block, elem: elItem }, tech);

                    if (!isNotActual(mod)) {
                        processMods({ block, elem: elItem, mods: mod, tech });
                    }
                } else {
                    const elemNames = Array.isArray(elItem.elem) ? elItem.elem : [elItem.elem];
                    const modsExists = !isNotActual(elItem.mods);

                    for (let elemName of elemNames) {
                        add({ block: block, elem: elemName }, tech);

                        if (!isNotActual(mod)) {
                            processMods({ block, elem: elemName, mods: mod, tech });
                        }

                        if (modsExists) {
                            processMods({ block, elem: elemName, mods: elItem.mods, tech });
                        }
                    }
                }
            }
        }

        if (!isNotActual(mod) && elems) {
            processMods({ block, mods: mod, tech });
        }

        if (!isNotActual(mods)) {
            processMods({ block, mods: mods, tech });
        }

        if (elems) {
            if (!Array.isArray(elems)) {
                elems = [elems];
            }
            for (let elItem of elems) {
                if (typeof elItem === 'string') {
                    add({ block: block, elem: elItem }, tech);
                } else {
                    const elemNames = Array.isArray(elItem.elem) ? elItem.elem : [elItem.elem];
                    const modsExists = !isNotActual(elItem.mods);

                    for (let elemName of elemNames) {
                        add({ block: block, elem: elemName }, tech);
                        if (modsExists) {
                            processMods({ block, elem: elemName, mods: elItem.mods, tech });
                        }
                    }
                }
            }
        }
    }

    return res;

    function add(entity, tech) {
        const str = naming.stringify(entity) + tech;

        if (!hash[str]) {
            res.push({
                entity: entity,
                tech: tech
            });
        }

        hash[str] = true;
    }

    function getMod(entity) {
        const mod = {};

        if (!entity.mod) { return mod; }

        const val = entity.hasOwnProperty('val') ?
            entity.val
            : true;

        if (val || val === 0) {
            mod[entity.mod] = val;
        }

        return mod;
    }

    function getMods(entity) {
        const mods = {};

        if (!entity.mods) {
            return mods;
        }

        for (let modName in entity.mods) {
            mods[modName] = entity.mods[modName];
        }

        return mods;
    }

    /**
      * @param {Object} entity - data
      * @param {String} entity.block - block name
      * @param {String=} entity.elem - elem name
      * @param {Object} entity.mods - list of mods
      * @param {String=} entity.tech - tech
      */
    function processMods(entity) {
        const block = entity.block;
        const elem = entity.elem;
        const mods = entity.mods;
        const tech = entity.tech;

        for (let modName of Object.keys(mods)) {
            let modVals = mods[modName];

            if (!Array.isArray(modVals)) {
                modVals = [modVals];
            }

            for (let modVal of modVals) {
                const item = {};

                item.block = block;
                elem && (item.elem = elem);
                item.modName = modName;
                item.modVal = modVal;

                add(item, tech);
            }
        }
    }

    function isNotActual(obj) {
        return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);
    }
};
