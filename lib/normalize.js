var naming = require('bem-naming');

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
            block = entity.name,
            mods = entity.mods,
            elems = entity.elems;

        add({ block: block });

        if (mods) {
            normalizeMods(block, mods);
        }

        if (elems) {
            for (var j = 0; j < elems.length; ++j) {
                var elem = elems[j],
                    elemName = elem.name,
                    elemMods = elem.mods;

                add({ block: block, elem: elemName });

                if (elemMods) {
                    normalizeMods(block, elemName, elemMods);
                }
            }
        }
    }

    function normalizeMods(block, elem, mods) {
        var isElem = arguments.length === 3;

        if (!isElem) {
            mods = elem;
        }

        for (var i = 0; i < mods.length; ++i) {
            var mod = mods[i],
                vals = mod.vals,
                l = vals && vals.length,
                resItem;

            if (l) {
                for (var j = 0; j < l; ++j) {
                    resItem = {
                        block: block,
                        modName: mod.name, modVal: vals[i].name
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
