var BemEntity = require('@bem/entity-name');

module.exports.defaultPlugins = [
    function copyMods(jsx, bemjson) {
        bemjson.mods && Object.assign(jsx.props, bemjson.mods);
    },
    function copyCustomFields(jsx, bemjson) {
        var blackList = ['content', 'block', 'elem', 'mods', 'tag', 'js'];

        Object.keys(bemjson).forEach(k => {
            if(~blackList.indexOf(k)) { return; }

            jsx.props[k] = bemjson[k];
        });
    }
];
