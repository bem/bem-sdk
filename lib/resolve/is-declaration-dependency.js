export default function isDeclarationDependency(dependantTech, dependencyTech, requiredTech) {
    if (!requiredTech || !dependencyTech) return false;

    return dependantTech ? dependencyTech !== dependantTech : dependencyTech !== requiredTech;
}
