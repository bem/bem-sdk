import { stringify as stringifyEntity } from 'bem-naming';
import BemTypifier from './bem-typifier';

export default function addNativeDependencies(declaration, dependencyGraph) {
    let bemTypifier = new BemTypifier();

    for (let entity of dependencyGraph.entities()) {
        bemTypifier.typify(entity);
    }

    for (let entity of declaration) {
        bemTypifier.typify(entity);
    }

    for (let modifier of bemTypifier.blockModificators()) {
        let modifierId = stringifyEntity(modifier),
            blockId = modifier.block,
            block = { block: blockId };

        if (!bemTypifier._entityMap.has(blockId)) continue;

        let hasOrderedDependency = false;

        for (let blockDependency of dependencyGraph.orderedDependenciesOf(block)) {
            if (stringifyEntity(blockDependency) === modifierId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(modifier, block, { order: 'blockBeforeBlockModifier' });
        }
    }

    for (let booleanModifier of bemTypifier.blockModificators()) {
        if (booleanModifier.modVal === true) {
            let block = booleanModifier.block,
                modName = booleanModifier.modName,
                ignoreVals = [];

            for (let modifierDependency of dependencyGraph.orderedDependenciesOf(booleanModifier)) {
                if (modifierDependency.block === block && modifierDependency.modName === modName) {
                    ignoreVals.push(modifierDependency.modVal);
                }
            }

            for (let modifier of bemTypifier.blockModificators()) {
                if (modifier.block === block &&
                    modifier.modName === modName &&
                    ignoreVals.indexOf(modifier.modVal) === -1 &&
                    modifier.modVal !== true
                ) {
                    dependencyGraph.addDependency(modifier, booleanModifier, {
                        order: 'blockBooleanModifierBeforeBlockModifier'
                    });
                }
            }
        }
    }

    for (let modifier of bemTypifier.elementModificators()) {
        let modifierId = stringifyEntity(modifier),
            element = { block: modifier.block, elem: modifier.elem },
            elementId = stringifyEntity(element);

        if (!bemTypifier._entityMap.has(elementId)) continue;

        let hasOrderedDependency = false;

        for (let elementDependency of dependencyGraph.orderedDependenciesOf(element)) {
            if (stringifyEntity(elementDependency) === modifierId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(modifier, element, { order: 'elementBeforeElementModifier' });
        }
    }

    for (let booleanModifier of bemTypifier.elementModificators()) {
        if (booleanModifier.modVal === true) {
            let block = booleanModifier.block,
                elem = booleanModifier.elem,
                modName = booleanModifier.modName,
                ignoreVals = [];

            for (let modifierDependency of dependencyGraph.orderedDependenciesOf(booleanModifier)) {
                if (modifierDependency.block === block &&
                    elem &&
                    modifierDependency.elem === elem &&
                    modifierDependency.modName === modName
                ) {
                    ignoreVals.push(modifierDependency.modVal);
                }
            }

            for (let modifier of bemTypifier.elementModificators()) {
                if (modifier.block === block &&
                    elem &&
                    modifier.elem === elem &&
                    modifier.modName === modName &&
                    ignoreVals.indexOf(modifier.modVal) === -1 &&
                    modifier.modVal !== true
                ) {
                    dependencyGraph.addDependency(modifier, booleanModifier, {
                        order: 'elementBooleanModifierBeforeElementModifier'
                    });
                }
            }
        }
    }

    for (let modifier of bemTypifier.elementModificators()) {
        let modifierId = stringifyEntity(modifier),
            blockId = modifier.block,
            block = { block: blockId };

        if (!bemTypifier._entityMap.has(blockId)) continue;

        let hasOrderedDependency = false;

        for (let blockDependency of dependencyGraph.orderedDependenciesOf(block)) {
            if (stringifyEntity(blockDependency) === modifierId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(modifier, block, { order: 'blockBeforeElementModifier' });
        }
    }

    for (let element of bemTypifier.elements()) {
        let elementId = stringifyEntity(element),
            blockId = element.block,
            block = { block: blockId };

        if (!bemTypifier._entityMap.has(blockId)) continue;

        let hasOrderedDependency = false;

        for (let blockDependency of dependencyGraph.orderedDependenciesOf(block)) {
            if (stringifyEntity(blockDependency) === elementId) {
                hasOrderedDependency = true;
                break;
            }
        }

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency(element, block, { order: 'blockBeforeElement' });
        }
    }
}
