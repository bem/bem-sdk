var scan = require('scan-level');

module.exports = function run(levels, scheme, done) {
    var opts = {};

    if (scheme === 'flat') {
        opts.scanner = scanSimple;
    }

    var n = 0,
        l = levels.length;

    if (l === 0) {
        return done();
    } else {
        for (var i = 0; i < l; ++i) {
            scan(levels[i], opts, scancb);
        }
    }

    function scancb(err) {
        if (err) {
            done(err);
            n = l + 1;
        }

        ++n === l && done();
    }
}

function scanSimple(block, elem, items, next) {
    var file = block.file,
        underscore = file.indexOf('_'),
        dot = file.indexOf('.'),
        bk = file.substr(0, underscore !== -1 ? underscore : dot),
        el;

    if (!bk || dot < underscore) { return next(); }

    var suffix = file.substr(dot),
        item = {
            block: bk,
            suffix: suffix
        };

    file = file.substring(0, dot);

    if (underscore === -1) {
        items.push(block, item);
        next();
        return;
    }

    file = file.substr(underscore + 1);
    underscore = file.indexOf('_', 1);

    if (file[0] === '_') {
        el = file.substring(1, underscore !== -1 ? underscore : file.length);
        item.elem = el;

        // block__elem
        if (underscore === -1) {
            items.push(block, item);
            next();
            return;
        }

        file = file.substr(underscore + 1);
    }

    underscore = file.indexOf('_');
    item.mod = file.substring(0, underscore !== -1 ? underscore : file.length);

    // block_mod or block__elem_mod
    if (underscore === -1) {
        items.push(block, item);
        next();
        return;
    }

    // block_mod_val or block__elem_mod_val
    item.val = file.substr(underscore + 1);

    items.push(block, item);
    next();
}
