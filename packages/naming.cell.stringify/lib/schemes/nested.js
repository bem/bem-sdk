import path from 'node:path';
import assert from 'node:assert';
import BemCell from '@bem/sdk.cell';
import bemNaming from '@bem/sdk.naming.entity';

import presets from '../presets.js';

export default {
    path: function(cell, options) {
        assert(BemCell.isBemCell(cell),
            'Provide instance of [@bem/sdk.cell](https://github.com/bem/bem-sdk/tree/master/packages/cell).'
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

        cell.layer && (layer = cell.layer + '.blocks');

        var elemDelim = opts.elemDirDelim;
        var modDelim = opts.modDirDelim;

        var folder = path.join(layer, entity.block,
                entity.elem ? (elemDelim + entity.elem) : '',
                entity.mod ? (modDelim + entity.mod.name) : '');

        return path.join(folder,
            b_.stringify(entity) + (tech ? '.' + tech : ''));
    }
};
