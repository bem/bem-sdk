function normalizeEntity(res, entity) {
    var block = entity.block,
        mods = getMods(entity),
        elems = entity.elems ? entity.elems : entity.elem && [{ name: entity.elem, mods: mods }];

    res.push({ block: block });

    if (elems && elems.length) {
        for (var i = 0; i < elems.length; ++i) {
            var elem = elems[i];

            if (typeof elem === 'object') {
                var elemName = elem.name,
                    elemMods = getMods(entity);

                res.push({ block: block, elem: elemName });

                if (elemMods) {
                    normalizeMods(res, mods, block, elemName);
                }
            } else {
                res.push({ block: block, elem: elem });
            }
        }
    }

    if (!entity.elem && mods) {
        normalizeMods(res, mods, block);
    }
}

function normalizeMods(res, mods, blockName, elemName) {
    var push = arguments.length === 3 ? function (modName, modVal) {
        res.push({
            block: blockName,
            modName: modName, modVal: modVal
        });
    } : function (modName, modVal) {
        res.push({
            block: blockName, elem: elemName,
            modName: modName, modVal: modVal
        });
    } ;

    for (var modName in mods) {
        var modVals = mods[modName];

        if (typeof modVals !== 'object') {
            modVals = [modVals];
        }

        for (var i = 0; i < modVals.length; ++i) {
            push(modName, modVals[i]);
        }
    }
}

function getMods(entity) {
    var modName = entity.modName || entity.mod,
        mods = entity.mods;

    if (modName) {
        mods = {};

        mods[modName] = entity.modName ? entity.modVal || true : true;
    }

    if (!mods) {
        return;
    }

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
    var res = [];

    if (!entities) { return []; }
    if (typeof entities.length === 'undefined') { entities = [entities]; }

    for (var i = 0; i < entities.length; ++i) {
        normalizeEntity(res, entities[i]);
    }

    return res;
};
