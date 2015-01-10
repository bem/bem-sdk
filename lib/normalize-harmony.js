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

    // is not array
    if (typeof mods.length === 'undefined') {
        return mods;
    }

    var res = {};

    for (var i = 0; i < mods.length; ++i) {
        modName = mods[i];

        res[modName] = true;
    }

    return res;
}

module.exports = function (entities) {
    var res = [],
        hash = {};

    function add(entity) {
        var str = naming.stringify(entity);

        if (!hash[str]) {
            res.push(entity);
        }

        hash[str] = true;
    }

    if (!entities) { return []; }
    // is not array
    if (typeof entities.length === 'undefined') { entities = [entities]; }

    for (var i = 0; i < entities.length; ++i) {
        var entity = entities[i],
            block = entity.block,
            mods = getMods(entity),
            elems = entity.elems ? entity.elems : entity.elem && [{ name: entity.elem, mods: mods }];

        add({ block: block });

        if (elems) {
            for (var j = 0; j < elems.length; ++j) {
                var elem = elems[j];

                if (typeof elem === 'object') {
                    var elemName = elem.name,
                        elemMods = getMods(entity);

                    add({ block: block, elem: elemName });

                    if (elemMods) {
                        normalizeMods(block, elemName, mods);
                    }
                } else {
                    add({ block: block, elem: elem });
                }
            }
        } else if (!entity.elem && mods) {
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
