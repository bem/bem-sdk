'use strict';

const vow = require('vow');
const Level = require('enb/lib/levels/level');
const LevelPlain = require('enb/lib/levels/level-plain');

module.exports = function run(levels, scheme, done) {
    var plain = scheme === 'flat' ? LevelPlain : null;

    vow.all(levels.map(function (level) {
        return (new Level(level, plain)).load();
    })).then(done, done);
}
