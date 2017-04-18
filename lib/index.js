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

Transformer.prototype.transform = function(node, bemjson) {
    // if (Array.isArray(bemjson)) {
    //     return bemjson.map(bj => this.transform(bj));
    // }

    // var node = new JSXNode();

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

    // node.children = bemjson.content && this.transform(bemjson.content);

    return node;
}

Transformer.prototype.process = function(bemjson) {
    var nodes = [{
        json: bemjson,
        id: 0,
        tree: []
    }];

    var root = nodes[0];

    debugger;

    var node, tree;
    while(node = nodes.shift()) {
        var json = node.json;
        //var jsx = node.jsx;

        if (Array.isArray(json)) {
            for (var i = 0; i < json.length; i++) {
                var child = json[i];
                nodes.push({ json: child, id: i, tree: node.tree });
            }
        } else {
            var res = undefined;
            var jsx = new JSXNode();

            for (var i = 0; i < this.plugins.length; i++) {
                var plugin = this.plugins[i];
                res = plugin(jsx, json);
                if (res !== undefined) {
                    json = res;
                    node.json = json;
                    nodes.push(node);
                    break;
                }
            }

            this.transform(jsx, json);

            if (res === undefined) {
                var content = json.content;
                if (content) {
                    if (Array.isArray(content)) {
                        for (var i = 0; i < content.length; i++) {
                            var child = content[i];
                            nodes.push({ json: child, id: i, tree: jsx.children });
                        }
                    } else {
                        nodes.push({ json: content, id: 'children', tree: jsx});
                    }
                } else {
                    jsx.children = undefined;
                }
            }

            node.tree[node.id] = jsx;
        }
    }

    debugger;

    // var tree = this.transform(bemjson);
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
