var path = require('path');
var assert = require('assert');
var BemCell = require('@bem/cell');
var bemNaming = require('@bem/naming');

var presets = require('../presets');

module.exports = {
    path: function(cell, options) {
        assert(BemCell.isBemCell(cell),
            'Provide instance of [@bem/cell](https://github.com/bem-sdk/bem-cell).'
        );

        var opts;
        var b_;

        if (!options) {
            opts = presets['origin'];
            b_ = bemNaming;
        } else if (typeof options === 'string') {
            var preset = presets[options];
            assert(preset, 'there is no such preset check options');
            opts = preset;
            b_ = bemNaming(opts.naming);
        } else {
            var defaultOpts = presets['origin'];
            opts = {
                naming: options.naming || defaultOpts.naming
            };
            b_ = bemNaming(opts.naming);

            opts.elemDirDelim = typeof options.elemDirDelim === 'string'
                ? options.elemDirDelim
                : (b_.delims.elem);
            opts.modDirDelim = typeof options.modDirDelim  === 'string'
                ? options.modDirDelim
                : (b_.delims.mod.name);
        }

        var layer = '';
        var tech = cell.tech;
        var entity = cell.entity;
        var modName = Object(entity.mod).name;

        cell.layer && (layer = cell.layer);

        var elemDelim = opts.elemDirDelim;
        var modDelim = opts.modDirDelim;

        var folder = path.join(layer, entity.block,
                entity.elem ? (elemDelim + entity.elem) : '',
                modName ? (modDelim + modName) : '');

        return path.join(folder,
            b_.stringify(entity) + (tech ? '.' + tech : ''));
    }
};
