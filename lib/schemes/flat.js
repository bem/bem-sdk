var path = require('path'),
    BemCell = require('@bem/cell'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(entity, tech, options) {
        options || (options = {});

        var layer = '';
        var _tech = tech;

        if (BemCell.isBemCell(entity)) {
            entity.layer && (layer = entity.layer);
            if (typeof tech === 'object') {
                options = tech;
            }
            _tech = entity.tech;
            entity = entity.entity;
        }

        var naming = bemNaming(options.naming);

        return path.join(layer, naming.stringify(entity) + '.' + _tech);
    }
};
