
function JSXNode(tag, props, children) {
    this.tag = tag || 'div';
    this.props = props || {};
    this.children = children || [];
}

// TODO [object Object] -> { a: 'b', b: { c: 'c' }}
function objToStr(obj) {
}

JSXNode.prototype.toString = function() {
    // var objToStr => obj => Object.keys(obj).map(k => `{${k}: ${
    // var propVal = val => typeof val === 'object' ? `{
    var propsToStr = props => Object.keys(props).map(k => `${k}="${props[k]}"`).join(' ');
    var str = this.children ?
        `<${this.tag} ${propsToStr(this.props)}>${this.children}</${this.tag}>` :
        `<${this.tag} ${propsToStr(this.props)}/>`;
    return str;
}

function transform(bemjson) {
    var node = new JSXNode();
    bemjson.block && (node.tag = bemjson.block);
    bemjson.block && bemjson.elem && (node.tag = bemjson.block + '__' + bemjson.elem);
    bemjson.tag && (node.tag = bemjson.tag);

    var blackList = ['content', 'block', 'elem', 'mods', 'mix', 'attrs', 'js'];

    Object.keys(bemjson).forEach(k => {
        if(~blackList.indexOf(k)) return;

        node.props[k] = bemjson[k]; 
    });

    node.children = bemjson.content && transform(bemjson.content);

    return node;
}

module.exports = transform;
module.exports.objToStr = objToStr;
