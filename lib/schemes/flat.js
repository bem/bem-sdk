var bemNaming = require('bem-naming');

module.exports = {
    path: function(entity, tech, options) {
        options || (options = {});
        var naming = bemNaming(options.naming);

        return naming.stringify(entity) + '.' + tech;
    }
};
