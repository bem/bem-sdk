var path = require('path'),
    BemCell = require('@bem/cell'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(entity, tech, options) {
        options || (options = {});

        var layer = '';
        var modName = '';
        var _tech = tech;

        if (BemCell.isBemCell(entity)) {
            entity.layer && (layer = entity.layer);
            if (typeof tech === 'object') {
                options = tech;
            }
            _tech = entity.tech;
            entity = entity.entity;
            modName = Object(entity.mod).name;
        } else {
            modName = entity.modName;
        }

        var naming = bemNaming(options.naming);
        var folder = path.join(layer, entity.block,
                entity.elem ? (naming.elemDelim + entity.elem) : '',
                modName ? (naming.modDelim + modName) : '');

        return path.join(folder,
            naming.stringify(entity) + (_tech ? '.' + _tech : ''));
    }
};
