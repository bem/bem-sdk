'use strict';

module.exports = formatv1;

function formatv1(decl) {
    Array.isArray(decl) || decl && (decl = [decl]);

    if (!decl || !decl.length) {
        return [];
    }

    const prev = {};
    return decl.reduce((res, cell) => {
        if (!cell) { return res; }

        const entity = cell.entity;

        const pg = prev.group;
        const group = { entity, block: pg && pg.block, elem: pg && pg.elem };

        (() => {
            let item;

            if (!group.block || group.block.name !== entity.block) {
                group.block = { name: entity.block };
                group.elem = null;
                res.push(group.block);
            }

            if (entity.elem) {
                // Handle element
                if (!group.elem || group.elem.name !== entity.elem) {
                    item = group.elem = { name: entity.elem };

                    group.block.elems || (group.block.elems = []);
                    group.block.elems.push(item);
                } else {
                    item = group.elem;
                }
            } else {
                // Handle block
                item = group.block;
            }

            entity.mod && appendMod(item, entity.mod);
        })();

        // save previous block
        Object.assign(prev, { entity, group });

        return res;
    }, []);
}

function appendMod (item, mod) {
    item.mods || (item.mods = []);
    if (!mod) { return; }

    let modItem = item.mods.find(m => m.name === mod.name);
    modItem || item.mods.push(modItem = { name: mod.name, vals: [] });

    (mod.val && (mod.val !== true) || mod.val === 0) && modItem.vals.push({ name: mod.val });
}
