var path = require('path'),
    assert = require('assert'),
    BemCell = require('@bem/cell'),
    bemNaming = require('bem-naming');

module.exports = {
    path: function(cell, options) {
        assert(BemCell.isBemCell(cell),
            'Provide instance of [@bem/cell](https://github.com/bem-sdk/bem-cell).'
        )

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
