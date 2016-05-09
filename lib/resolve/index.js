import resolve from './resolve';
import isRelation from './is-relation';

export default function (declaration=[], relations=[], options={}) {
    if (!Array.isArray(relations)) {
        if (isRelation(relations)) {
            relations = [relations];
        } else if (arguments.length === 2) {
            options = relations;
            relations = [];
        }
    }

    if (typeof options === 'string') {
        options = { tech: options };
    }

    return resolve(declaration, relations, options);
}
