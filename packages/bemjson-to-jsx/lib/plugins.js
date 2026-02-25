import { camelCase } from 'change-case';
import { styleToObj, valToStr } from './helpers.js';

export const copyMods = () => function copyMods(jsx, bemjson) {
    bemjson.elem
        ? bemjson.elemMods && Object.assign(jsx.props, bemjson.elemMods)
        : bemjson.mods && Object.assign(jsx.props, bemjson.mods);
};

export const camelCaseProps = () => function camelCaseProps(jsx) {
    jsx.props = Object.keys(jsx.props).reduce((acc, propKey) => {
        acc[camelCase(propKey)] = jsx.props[propKey];
        return acc;
    }, {});
};

export const copyCustomFields = () => function copyCustomFields(jsx, bemjson) {
    const blackList = ['content', 'block', 'elem', 'mods', 'elemMods', 'tag', 'js'];

    Object.keys(bemjson).forEach(k => {
        if(~blackList.indexOf(k)) { return; }
        if(k === 'attrs') {
            bemjson[k]['style'] && (jsx.props['style'] = bemjson[k]['style']);
        }

        jsx.props[k] = bemjson[k];
    });
};

export const stylePropToObj = () => function stylePropToObj(jsx) {
    if (jsx.props['style']) {
        jsx.props['style'] = styleToObj(jsx.props['style'])
        jsx.props['attrs'] &&
            (jsx.props['attrs']['style'] = jsx.props['style']);
    }
};

export const keepWhiteSpaces = () => function keepWhiteSpaces(jsx) {
    if (jsx.isText) {
        if (jsx.simpleText[0] === ' ' || jsx.simpleText[jsx.simpleText.length - 1] === ' ') {
            // wrap to {} to keep spaces
            jsx.simpleText = `{${valToStr(jsx.simpleText)}}`;
        }
    }
};

export const defaultPlugins = [
    keepWhiteSpaces,
    copyMods,
    camelCaseProps,
    copyCustomFields,
    stylePropToObj
];

export const whiteList = function(options) {
    options = options || {};
    return function(jsx) {
        if (options.entities && jsx.bemEntity) {
            if (!options.entities.some(white => jsx.bemEntity.isEqual(white))) {
                return '';
            }
        }
    }
};
