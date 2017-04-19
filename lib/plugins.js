var styleToObj = require('./helpers').styleToObj;

module.exports.defaultPlugins = [
    function copyMods(jsx, bemjson) {
        bemjson.mods && Object.assign(jsx.props, bemjson.mods);
    },
    function copyCustomFields(jsx, bemjson) {
        var blackList = ['content', 'block', 'elem', 'mods', 'tag', 'js'];

        Object.keys(bemjson).forEach(k => {
            if(~blackList.indexOf(k)) { return; }
            if(k === 'attrs') {
                bemjson[k]['style'] && (jsx.props['style'] = bemjson[k]['style']);
            }

            jsx.props[k] = bemjson[k];
        });
    },
    function stylePropToObj(jsx) {
        jsx.props['style'] &&
            (jsx.props['attrs']['style'] = jsx.props['style'] = styleToObj(jsx.props['style']));
    }
];

module.exports.whiteList = function(options) {
    options = options || {};
    return function(jsx) {
        if (options.entities && jsx.bemEntity) {
            if (!options.entities.some(white => jsx.bemEntity.isEqual(white))) {
                return '';
            }
        }
    }
};

