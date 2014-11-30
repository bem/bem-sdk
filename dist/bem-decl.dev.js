(function() {
    "use strict";

    var $$normalize$v1$$default = function (entities) {
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
    };

    function $$normalize$v2$$getMods(entity) {
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

    var $$normalize$v2$$default = function (entities) {
        var res = [];

        if (!entities) { return []; }
        // is not array
        if (typeof entities.length === 'undefined') { entities = [entities]; }

        for (var i = 0; i < entities.length; ++i) {
            var entity = entities[i],
                block = entity.block,
                mods = $$normalize$v2$$getMods(entity),
                elems = entity.elems ? entity.elems : entity.elem && [{ name: entity.elem, mods: mods }];

            res.push({ block: block });

            if (elems) {
                for (var j = 0; j < elems.length; ++j) {
                    var elem = elems[j];

                    if (typeof elem === 'object') {
                        var elemName = elem.name,
                            elemMods = $$normalize$v2$$getMods(entity);

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
    };

    var index$$default = {
        normalize: function (entities, version) {
            return version === '1.0' ? $$normalize$v1$$default(entities) : $$normalize$v2$$default(entities);
        }
    };

    var defineAsGlobal = true;
    // Node.js
    if (typeof exports === 'object') {
        module.exports = index$$default;
        defineAsGlobal = false;
    }

    // YModules
    if (typeof modules === 'object') {
        modules.define('bem-decl', function (provide) {
            provide(index$$default);
        });
        defineAsGlobal = false;
    }

    defineAsGlobal && (global.bemdecl = index$$default);
}).call(this);

//# sourceMappingURL=bem-decl.dev.js.map