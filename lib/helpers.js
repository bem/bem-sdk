
const propToStr = (key, val) => `'${key}': ${valToStr(val)}`;
const valToStr = val => {
    switch(typeof val) {
        case 'string':
            return `'${val}'`;
        case 'object':
            return val === null ?
                null : Array.isArray(val) ?
                    arrayToStr(val) : objToStr(val);
        default:
            return val;
    }
};

function arrayToStr(arr) {
    return `[${arr.join(', ')}]`;
}

function objToStr(obj) {
    const keys = Object.keys(obj);
    if (!keys.length) return '';
    return `{ ${keys.map(k => propToStr(k, obj[k])).join(', ')} }`;
}

module.exports = {
    objToStr
};
