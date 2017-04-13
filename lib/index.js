var reactMappings = require('./reactMappings');
var { valToStr } = require('./helpers');

function JSXNode(tag, props, children) {
    this.tag = tag || 'div';
    this.props = props || {};
    this.children = children || [];
}

var propsToStr = props => Object.keys(props).map(k => `${k}={${valToStr(props[k])}}`).join(' ');
var tagToClass = tag => reactMappings[tag] ? tag : tag.slice(0, 1).toUpperCase() + tag.slice(1);

JSXNode.prototype.toString = function() {
    var tag = tagToClass(this.tag);
    var str = this.children ?
        `<${tag} ${propsToStr(this.props)}>${this.children}</${tag}>` :
        `<${tag} ${propsToStr(this.props)}/>`;
    return str;
}

function transform(bemjson) {
    if (Array.isArray(bemjson)) {
        return bemjson.map(bj => transform(bj)).join('\n');
    }
    var node = new JSXNode();
    bemjson.block && (node.tag = bemjson.block);
    bemjson.block && bemjson.elem && (node.tag = bemjson.block + '__' + bemjson.elem);
    bemjson.tag && (node.tag = bemjson.tag);
    bemjson.mods && Object.assign(node.props, bemjson.mods);

    var blackList = ['content', 'block', 'elem', 'mods', 'tag', 'js'];

    Object.keys(bemjson).forEach(k => {
        if(~blackList.indexOf(k)) { return; }

        node.props[k] = bemjson[k];
    });

    node.children = bemjson.content && transform(bemjson.content);

    return node;
}

module.exports = transform;
