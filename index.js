module.exports = function(name) {
    try {
        return require('./lib/schemes/' + (name || 'nested'));
    } catch(e) {
        throw new Error('Scheme not found');
    }
};
