function normalize(res, block) {
    var blockName = block.name,
        mods = block.mods,
        elems = block.elems;

    res.push({ block: blockName });

    if (mods) {
        normalizeMods(res, mods, blockName);
    }

    if (elems) {
        for (var i = 0; i < elems.length; ++i) {
            var elem = elems[i],
                elemName = elem.name,
                elemMods = elem.mods;

            res.push({ block: blockName, elem: elemName });

            if (elemMods) {
                normalizeMods(res, elemMods, blockName, elemName);
            }
        }
    }
}

function normalizeMods(res, mods, blockName, elemName) {
    for (var i = 0; i < mods.length; ++i) {
        var mod = mods[i],
            vals = mod.vals;

        var push = elemName ? function (modName, modVal) {
            res.push({
                block: blockName, elem: elemName,
                modName: modName, modVal: modVal
            });
        } : function (modName, modVal) {
            res.push({
                block: blockName,
                modName: modName, modVal: modVal
            });
        };

        for (var j = 0; j < vals.length; ++j) {
            push(mod.name, vals[j].name);
        }
    }
}

module.exports = function (entities) {
    var res = [];

    if (!entities) { return []; }
    if (typeof entities.length === 'undefined') { entities = [entities]; }

    for (var i = 0; i < entities.length; ++i) {
        normalize(res, entities[i]);
    }

    return res;
};
