import vow from 'vow';
import Level from 'enb/lib/levels/level';
import LevelPlain from 'enb/lib/levels/level-plain';

export default function run(levels, scheme, done) {
    var plain = scheme === 'flat' ? LevelPlain : null;

    vow.all(levels.map(function (level) {
        return (new Level(level, plain)).load();
    })).then(done, done);
}
