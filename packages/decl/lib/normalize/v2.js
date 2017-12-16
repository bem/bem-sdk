'use strict';

const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const declAssign = require('../assign');

module.exports = function (decl, scope) {
    const res = [];
    const hash = {};

    if (!decl) { return res; }

    if (typeof decl === 'string' || !(Symbol.iterator in decl)) {
        decl = [decl];
    }

    for (let entity of decl) {
        let block, mod, val, mods, elem, elems, tech;

        if (typeof entity === 'string') {
            block = entity;
        } else {
            tech = entity.tech || null;

            const keys = Object.keys(entity).filter(key => key !== 'tech');

            if (keys.length === 0) {
                add({ block: null }, tech);
                continue;
            }
            block = entity.block || null;
            elem = entity.elem || null;
            elems = entity.elems;
            mod = getMod(entity) || null;
            val = entity.val;
            mods = getMods(entity);
        }

        // we should return block always if elems or mods given
        if (elems || !isNotActual(mods) && isNotActual(elem)) {
            add({ block: block }, tech);
        }

        if (block) {
            if (isNotActual(elem) && isNotActual(mod)) {
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
                    if (!isNotActual(mods)) {
                        processMods({ block, elem: elItem, mods, tech });
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

                        if (!isNotActual(mods)) {
                            processMods({ block, elem: elemName, mods, tech });
                        }
                    }
                }
            }
        }

        if (!isNotActual(mod) && elems && !elem) {
            processMods({ block, mods: mod, tech });
        }

        if (!isNotActual(mods) && !elem) {
            processMods({ block, mods: mods, tech });
        }

        if (!isNotActual(mod) && (!elems && !elem)) {
            processMods({ block, mods: mod, tech });
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

        if (isNotActual(mod) && val) {
            const item = {};
            item.block = block;
            elem && (item.elem = elem);
            item.modName = null;
            item.modVal = val;

            if (typeof val !== 'boolean') {
                add(Object.assign({}, item, { modVal: true }), tech);
            }

            add(item, tech);
        }
    }

    return res;

    function add(rawEntity, tech) {
        const cell = cellify({ entity: rawEntity, tech });
        const id = cell.id;

        if (hash[id]) {
            return;
        }

        hash[id] = true;
        res.push(cell);
    }

    function cellify(data) {
        if (scope) {
            return declAssign(data, scope);
        }
        data.entity = new BemEntityName(data.entity);
        return new BemCell(data);
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

        if (Array.isArray(entity.mods)) {
            entity.mods.forEach(modName => {
                mods[modName] = true;
            });
        } else {
            for (let modName in entity.mods) {
                mods[modName] = entity.mods[modName];
            }
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

                if (typeof modVal !== 'boolean') {
                    add(Object.assign({}, item, { modVal: true }), tech);
                }

                add(item, tech);
            }
        }
    }

    function isNotActual(obj) {
        return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);
    }
};
