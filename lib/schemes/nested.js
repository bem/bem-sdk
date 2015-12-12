var path = require('path'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(entity, tech, options) {
        options || (options = {});
        var naming = bemNaming(options.naming),
            elemFolder = naming.elemDelim + entity.elem,
            modFolder = naming.modDelim + entity.modName,
            folder = path.join(entity.block,
                entity.elem ? elemFolder : '',
                entity.modName ? modFolder : '');

        // TODO: support techs as folders
        return path.join(folder,
            naming.stringify(entity) + '.' + tech);
    }
};
