var path = require('path'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(cell, options) {
        options || (options = {});

        var layer = '';
        var tech = cell.tech;
        var entity = cell.entity;

        cell.layer && (layer = cell.layer);

        var naming = bemNaming(options.naming);

        return path.join(layer,
            naming.stringify(entity) + (tech ? '.' + tech : ''));
    }
};
