'use strict';

const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const declAssign = require('../../assign');

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
            mod = getMod(entity);
            val = entity.val;
            mods = getMods(entity);
        }

        // we should return scope always if elems or mods given
        if (!block && (elems || !isNotActual(mods) && isNotActual(elem))) {
            add({}, tech);
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
                    if (isNotActual(mod)) {
                        add({ block: block, elem: elItem }, tech);
                    }

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
                        if (isNotActual(mod)) {
                            add({ block: block, elem: elemName }, tech);
                        }

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
                    const elemMod = getMod(elItem);
                    const elemMods = getMods(elItem);
                    const hasMod = !isNotActual(elemMod);
                    const hasMods = !isNotActual(elemMods);

                    for (let elemName of elemNames) {
                        hasMod ?
                            processMods({ block, elem: elemName, mods: elemMod, tech }) :
                            add({ block: block, elem: elemName }, tech);

                        hasMods && processMods({ block, elem: elemName, mods: elemMods, tech });
                    }
                }
            }
        }

        if (isNotActual(mod) && val) {
            const item = {};
            item.block = block;
            elem && (item.elem = elem);

            if (typeof val !== 'boolean') {
                add(Object.assign({ mod: { val: true } }, item), tech);
            }

            item.mod = {name: null, val: val};
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
            entity.mods.forEach(name => {
                mods[name] = true;
            });
        } else {
            for (let name in entity.mods) {
                mods[name] = entity.mods[name];
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

        for (let mName of Object.keys(mods)) {
            let mVals = mods[mName];

            if (!Array.isArray(mVals)) {
                mVals = [mVals];
            }

            for (let mVal of mVals) {
                const item = {};

                item.block = block;
                elem && (item.elem = elem);

                if (typeof mVal !== 'boolean') {
                    add(Object.assign({ mod: { name: mName, val: true } }, item), tech);
                }

                item.mod = { name: mName, val: mVal };

                add(item, tech);
            }
        }
    }

    function isNotActual(obj) {
        return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);
    }
};
