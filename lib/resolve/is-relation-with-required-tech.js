export default function isRelationWithRequiredTech(relation, requiredTech) {
    if (!relation.tech) return true;

    return relation.tech === requiredTech;
}
