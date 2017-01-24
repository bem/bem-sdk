var path = require('path'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(cell, options) {
        options || (options = {});

        var layer = '';
        var tech = cell.tech;
        var entity = cell.entity;
        var modName = Object(entity.mod).name;

        cell.layer && (layer = cell.layer);

        var naming = bemNaming(options.naming);
        var folder = path.join(layer, entity.block,
                entity.elem ? (naming.elemDelim + entity.elem) : '',
                modName ? (naming.modDelim + modName) : '');

        return path.join(folder,
            naming.stringify(entity) + (tech ? '.' + tech : ''));
    }
};
