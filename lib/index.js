var bn = require('@bem/naming');
var BemEntity = require('@bem/entity-name');
var pascalCase = require('pascal-case');

var reactMappings = require('./reactMappings');
var valToStr = require('./helpers').valToStr;

var plugins = require('./plugins');

function JSXNode(tag, props, children) {
    this.tag = tag || 'div';
    this.props = props || {};
    this.children = children || [];
    this.bemEntity = null;
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
    var children = [].concat(this.children)
        .filter(Boolean)
        // remove empty text nodes
        .filter(child => !(child.isText && child.simpleText === ''));

    var str = children.length ?
        `<${tag}${propsToStr(this.props)}>\n${children.join('\n')}\n</${tag}>` :
        `<${tag}${propsToStr(this.props)}/>`;
    return str;
};

function Transformer(options) {
    this.plugins = plugins.defaultPlugins;
    this.bemNaming = bn(options.naming || 'react');
}

Transformer.prototype.process = function(bemjson) {
    var nodes = [{
        json: bemjson,
        id: 0,
        blockName: '',
        tree: []
    }];
    var root = nodes[0];

    var node;
    while((node = nodes.shift())) {
        var json = node.json, i;

        if (Array.isArray(json)) {
            for (i = 0; i < json.length; i++) {
                nodes.push({ json: json[i], id: i, tree: node.tree, blockName: node.blockName});
            }
        } else {
            var res = undefined;
            var jsx = new JSXNode();
            var blockName = json.block || node.blockName;

            if (typeof json === 'string') {
                jsx.isText = true;
                jsx.simpleText = json;
            }

            if (json.tag) {
                jsx.tag = json.tag;
            } else if (json.block || json.elem) {
                jsx.bemEntity = new BemEntity({block: blockName, elem: json.elem});
                jsx.tag = this.bemNaming.stringify(jsx.bemEntity);
            }

            for (i = 0; i < this.plugins.length; i++) {
                var plugin = this.plugins[i];
                res = plugin(jsx, json);
                if (res !== undefined) {
                    json = res;
                    node.json = json;
                    node.blockName = blockName;
                    nodes.push(node);
                    break;
                }
            }

            if (res === undefined) {
                var content = json.content;
                if (content) {
                    if (Array.isArray(content)) {
                        for (i = 0; i < content.length; i++) {
                            nodes.push({ json: content[i], id: i, tree: jsx.children, blockName: blockName });
                        }
                    } else {
                        nodes.push({ json: content, id: 'children', tree: jsx, blockName: blockName});
                    }
                } else {
                    jsx.children = undefined;
                }
            }

            node.tree[node.id] = jsx;
        }
    }

    return {
        bemjson: root.json,
        tree: root.tree,
        get JSX() {
            return render(root.tree);
        }
    };
};

Transformer.prototype.use = function() {
    [].push.apply(this.plugins, arguments)
    return this;
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
module.exports.plugins = plugins;
