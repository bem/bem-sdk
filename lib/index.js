var reactMappings = require('./reactMappings');
var valToStr = require('./helpers').valToStr;

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
        `<${tag} ${propsToStr(this.props)}>${[].concat(this.children).join('\n')}</${tag}>` :
        `<${tag} ${propsToStr(this.props)}/>`;
    return str;
};

function transform(bemjson) {
    if (Array.isArray(bemjson)) {
        return bemjson.map(bj => transform(bj));
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

function Transformer() {
    this.plugins = [];
}

Transformer.prototype.use = function() {
    [].push.apply(this.plugins, arguments)
    return this;
};

Transformer.prototype.process = function(bemjson) {
    var tree = transform(bemjson);
    this.plugins.forEach(plugin => {
        plugin(tree);
    });
    return {
        tree: tree,
        get JSX() {
            return render(this.tree);
        }
    };
};

function render(tree) {
    return Array.isArray(tree) ?
        tree.join('\n') :
        tree.toString();
}

Transformer.prototype.Transformer = Transformer;

module.exports = function() {
    return new Transformer();
};
