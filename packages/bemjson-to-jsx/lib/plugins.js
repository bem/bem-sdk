var camelCase = require('camel-case');
var helpers = require('./helpers');
var styleToObj = helpers.styleToObj;
var valToStr = helpers.valToStr;

module.exports.copyMods = () => function copyMods(jsx, bemjson) {
    bemjson.elem
        ? bemjson.elemMods && Object.assign(jsx.props, bemjson.elemMods)
        : bemjson.mods && Object.assign(jsx.props, bemjson.mods);
};

module.exports.camelCaseProps = () => function camelCaseProps(jsx) {
    jsx.props = Object.keys(jsx.props).reduce((acc, propKey) => {
        acc[camelCase(propKey)] = jsx.props[propKey];
        return acc;
    }, {});
};

module.exports.copyCustomFields = () => function copyCustomFields(jsx, bemjson) {
    var blackList = ['content', 'block', 'elem', 'mods', 'elemMods', 'tag', 'js'];

    Object.keys(bemjson).forEach(k => {
        if(~blackList.indexOf(k)) { return; }
        if(k === 'attrs') {
            bemjson[k]['style'] && (jsx.props['style'] = bemjson[k]['style']);
        }

        jsx.props[k] = bemjson[k];
    });
};

module.exports.stylePropToObj = () => function stylePropToObj(jsx) {
    if (jsx.props['style']) {
        jsx.props['style'] = styleToObj(jsx.props['style'])
        jsx.props['attrs'] &&
            (jsx.props['attrs']['style'] = jsx.props['style']);
    }
};

module.exports.keepWhiteSpaces = () => function keepWhiteSpaces(jsx) {
    if (jsx.isText) {
        if (jsx.simpleText[0] === ' ' || jsx.simpleText[jsx.simpleText.length - 1] === ' ') {
            // wrap to {} to keep spaces
            jsx.simpleText = `{${valToStr(jsx.simpleText)}}`;
        }
    }
};

module.exports.defaultPlugins = [
    module.exports.keepWhiteSpaces,
    module.exports.copyMods,
    module.exports.camelCaseProps,
    module.exports.copyCustomFields,
    module.exports.stylePropToObj
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

