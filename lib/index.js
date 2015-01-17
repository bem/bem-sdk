var normalize = require('./normalize'),
    normalize2 = require('./normalize-harmony');

module.exports = {
    normalize: function (entities, opts) {
        opts || (opts = {});
        return opts.harmony ? normalize2(entities) : normalize(entities);
    },
    merge: require('./merge'),
    subtract: require('./subtract')
};
