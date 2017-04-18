var bn = require('@bem/naming');
var BemEntity = require('@bem/entity-name');
var pascalCase = require('pascal-case');

var reactMappings = require('./reactMappings');
var valToStr = require('./helpers').valToStr;

function JSXNode(tag, props, children) {
    this.tag = tag || 'div';
    this.props = props || {};
    this.children = children || [];
    this.isText = false;
    this.simpleText = '';
}

var propsToStr = props => Object.keys(props).reduce((acc, k) => {
        if (typeof props[k] === 'string') {
            return acc + ` ${k}=${valToStr(props[k])}`
        } else {
            return acc + ` ${k}={${valToStr(props[k])}}`
        }
    }, '');
var tagToClass = tag => reactMappings[tag] ? tag : pascalCase(tag);

JSXNode.prototype.toString = function() {
    if (this.isText) {
        return this.simpleText;
    }
    var tag = tagToClass(this.tag);
    var str = this.children ?
        `<${tag}${propsToStr(this.props)}>\n${[].concat(this.children).join('\n')}\n</${tag}>` :
        `<${tag}${propsToStr(this.props)}/>`;
    return str;
};

function Transformer(options) {
    this.plugins = [];
    this.bemNaming = bn(options.naming || 'react');
}

Transformer.prototype.transform = function(bemjson) {
    if (Array.isArray(bemjson)) {
        return bemjson.map(bj => this.transform(bj));
    }

    var node = new JSXNode();

    if (typeof bemjson === 'string') {
        node.isText = true;
        node.simpleText = bemjson;
        return node;
    }
    if (bemjson.tag) {
        node.tag = bemjson.tag;
    } else if (bemjson.block) {
        var entity = new BemEntity({block: bemjson.block, elem: bemjson.elem});
        node.tag = this.bemNaming.stringify(entity);
    }
    bemjson.mods && Object.assign(node.props, bemjson.mods);

    var blackList = ['content', 'block', 'elem', 'mods', 'tag', 'js'];

    Object.keys(bemjson).forEach(k => {
        if(~blackList.indexOf(k)) { return; }

        node.props[k] = bemjson[k];
    });

    node.children = bemjson.content && this.transform(bemjson.content);

    return node;
}

Transformer.prototype.use = function() {
    [].push.apply(this.plugins, arguments)
    return this;
};

Transformer.prototype.process = function(bemjson) {
    var tree = this.transform(bemjson);
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

module.exports = function(opts) {
    return new Transformer(opts || {});
};
module.exports.tagToClass = tagToClass;
