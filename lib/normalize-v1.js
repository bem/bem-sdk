export default function(entities) {
    var res = [];

    if (!entities) { return []; }
    if (typeof entities.length === 'undefined') { entities = [entities]; }

    for (var i = 0; i < entities.length; ++i) {
        var entity = entities[i],
            block = entity.name,
            mods = entity.mods,
            elems = entity.elems;

        res.push({ block: block });

        if (mods) {
            normalizeMods(block, mods);
        }

        if (elems) {
            for (var j = 0; j < elems.length; ++j) {
                var elem = elems[j],
                    elemName = elem.name,
                    elemMods = elem.mods;

                res.push({ block: block, elem: elemName });

                if (elemMods) {
                    normalizeMods(block, elemName, elemMods);
                }
            }
        }
    }

    function normalizeMods(block, elem, mods) {
        var l = arguments.length;

        if (l === 2) {
            mods = elem;
        }

        for (var i = 0; i < mods.length; ++i) {
            var mod = mods[i],
                vals = mod.vals;

            for (var j = 0; j < vals.length; ++j) {
                var resItem = {
                    block: block,
                    modName: mod.name, modVal: vals[i].name
                };

                l === 3 && (resItem.elem = elem);

                res.push(resItem);
            }
        }
    }

    return res;
}
