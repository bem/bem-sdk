var naming = require('bem-naming');

function getMods(entity) {
    var modName = entity.modName,
        mods = entity.mods;

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

    var res = {};

    for (var i = 0; i < mods.length; ++i) {
        modName = mods[i];

        res[modName] = true;
    }

    return res;
}

module.exports = function (decl) {
    var res = [],
        hash = {};

    function add(entity) {
        var str = naming.stringify(entity);

        if (!hash[str]) {
            res.push(entity);
        }

        hash[str] = true;
    }

    if (!decl) { return []; }
    if (!Array.isArray(decl)) { decl = [decl]; }

    for (var i = 0; i < decl.length; ++i) {
        var entity = decl[i],
            block, mods, elems;

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
            var scope = entity.scope;

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
            for (var j = 0; j < elems.length; ++j) {
                var elem = elems[j];

                if (typeof elem === 'string') {
                    add({ block: block, elem: elem });
                } else {
                    var elemName = elem.elem,
                        elemMods = getMods(elem);

                    add({ block: block, elem: elemName });

                    if (elemMods) {
                        normalizeMods(block, elemName, elemMods);
                    }
                }
            }
        }

        if (!entity.elem && mods) {
            normalizeMods(block, mods);
        }
    }

    function normalizeMods(block, elem, mods) {
        var isElem = arguments.length === 3;

        if (!isElem) {
            mods = elem;
        }

        var modNames = Object.keys(mods);

        for (var i = 0; i < modNames.length; ++i) {
            var modName = modNames[i],
                modVals = mods[modName];

            if (typeof modVals !== 'object') {
                modVals = [modVals];
            }

            for (var j = 0; j < modVals.length; ++j) {
                var resItem = {
                    block: block,
                    modName: modName, modVal: modVals[j]
                };

                isElem && (resItem.elem = elem);

                add(resItem);
            }
        }
    }

    return res;
};
