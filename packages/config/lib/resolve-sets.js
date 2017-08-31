'use strict';

const assert = require('assert');

const _ = {
    uniqWith: require('lodash.uniqwith'),
    isEqual: require('lodash.isequal')
};

// TODO: cache
module.exports = function resolveSets(sets) {
    return Object.keys(sets).reduce((acc, setName) => {
        acc[setName] = _.uniqWith(resolveSet(sets[setName], setName, sets), _.isEqual);
        return acc;
    }, {});
}

function resolveSet(setData, setName, sets) {
    if (typeof setData !== 'string') {
        return Array.isArray(setData) ? setData : [setData];
    }

    return setData.split(' ').reduce((setDataAcc, layerStr) => {
        if (!layerStr.includes('@')) {
            setDataAcc.push({ layer: layerStr });
            return setDataAcc;
        }

        const layerArr = layerStr.split('@');
        let layerName = layerArr[0];
        let libName = layerArr[1];

        if (!layerName) {
            const layerNameArr = libName.split('/');
            libName = layerNameArr.shift();

            const level = {
                library: libName
            };

            if (layerNameArr.length) {
                level.layer = layerNameArr.join('/');
            } else {
                level.set = setName;
            }

            setDataAcc.push(level);

            return setDataAcc;
        }

        assert(!libName.includes('/'), `You can't use set and layer simultaneously`);

        if (!libName) {
            assert(sets[layerName], 'Set `' + layerName + '` was not found');
            return setDataAcc.concat(resolveSet(sets[layerName], setName, sets));
        }

        setDataAcc.push({
            set: layerName,
            library: libName
        });

        return setDataAcc;
    }, []);
}
