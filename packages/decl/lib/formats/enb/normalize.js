import BemEntityName from '@bem/sdk.entity-name';
import BemCell from '@bem/sdk.cell';

/**
 * Normalizes enb declaration.
 *
 * @param {Array<{block: string, elem: ?string, mod: ?{name: string, val: (string|true)}, tech: ?string}>} items - declaration
 * @returns {BemCell[]}
 */
export default function (items) {
    return items.map(item => {
        const entityObj = { block: item.block };

        item.elem && (entityObj.elem = item.elem);

        if (item.mod) {
            entityObj.mod = { name: item.mod };
            item.val && (entityObj.mod.val = item.val);
        }

        return new BemCell({
            entity: new BemEntityName(entityObj),
            tech: item.tech
        });
    });
}
