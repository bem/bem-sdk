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

export default function (entities) {
    var res = [];

    if (!entities) { return []; }
    // is not array
    if (typeof entities.length === 'undefined') { entities = [entities]; }

    for (var i = 0; i < entities.length; ++i) {
        var entity = entities[i],
            block = entity.block,
            mods = getMods(entity),
            elems = entity.elems ? entity.elems : entity.elem && [{ name: entity.elem, mods: mods }];

        res.push({ block: block });

        if (elems) {
            for (var j = 0; j < elems.length; ++j) {
                var elem = elems[j];

                if (typeof elem === 'object') {
                    var elemName = elem.name,
                        elemMods = getMods(entity);

                    res.push({ block: block, elem: elemName });

                    if (elemMods) {
                        normalizeMods(block, elemName, mods);
                    }
                } else {
                    res.push({ block: block, elem: elem });
                }
            }
        }

        if (!entity.elem && mods) {
            normalizeMods(block, mods);
        }
    }

    function normalizeMods(block, elem, mods) {
        var l = arguments.length;

        if (l === 2) {
            mods = elem;
        }

        for (var modName in mods) {
            if (mods.hasOwnProperty(modName)) {
                var modVals = mods[modName];

                if (typeof modVals !== 'object') {
                    modVals = [modVals];
                }

                for (var i = 0; i < modVals.length; ++i) {
                    var resItem = {
                        block: block,
                        modName: modName, modVal: modVals[i]
                    };

                    l === 3 && (resItem.elem = elem);

                    res.push(resItem);
                }
            }
        }
    }

    return res;
}
