export default function isRelation(obj) {
    return Boolean(typeof obj === 'object' && !Array.isArray(obj) && obj.entity && obj.dependOn);
}
