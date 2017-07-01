'use strict';

function valToStr(val) {
    switch(typeof val) {
        case 'string':
            return `'${val}'`;
        case 'object':
            return val === null ?
                null : Array.isArray(val) ?
                    arrToStr(val) : objToStr(val);
        default:
            return val;
    }
}

function arrToStr(arr) {
    return `[${arr.map(e => valToStr(e)).join(', ')}]`;
}

function propToStr (key, val) {
    return `'${key}': ${valToStr(val)}`;
}

function objToStr(obj) {
    const keys = Object.keys(obj);
    if (!keys.length) { return '{}'; }
    return `{ ${keys.map(k => propToStr(k, obj[k])).join(', ')} }`;
}

function styleToObj(style) {
    if (typeof style === 'string') {
        return style.split(';').reduce((acc, st) => {
            if (st.length) {
                var prop = st.split(':');
                acc[prop[0]] = prop[1];
            }
            return acc;
        }, {});
    }
    return style;
}

module.exports = {
    objToStr,
    arrToStr,
    styleToObj,
    valToStr
};
