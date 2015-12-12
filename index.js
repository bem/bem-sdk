module.exports = function(name) {
    return require('./lib/schemes/' + (name || 'nested'));
};
