'use strict';

module.exports = (pattern) => {
    const separation = [];

    let ref = { separation };
    let lastPush = 0;
    let deeper = 0;

    const paletz = (i) => {
        ref.separation.push(pattern.slice(lastPush, i));
        lastPush = i + 1;
    };

    for (let i = 0, l = pattern.length; i < l; i++) {
        const ch = pattern.charCodeAt(i);
        // Raw text
        if (deeper % 2 === 0) {
            if (deeper > 1 && ch === 125 /* } */) {
                lastPush < i ? paletz(i) : lastPush = i + 1;
                ref.parentRef.separation.push(ref.separation);
                ref = ref.parentRef;
                deeper -= 2;
            } else if (ch === 36 /* $ */ && pattern.charCodeAt(i + 1) === 123 /* { */) {
                paletz(i);
                lastPush += 1; // Inc because of $
                deeper += 1;
            }
        // Variable
        } else {
            if (ch === 63 /* ? */) {
                ref = { separation: [], parentRef: ref };
                paletz(i);
                deeper += 1;
            } else if (ch === 125 /* } */) {
                paletz(i);
                deeper -= 1;
            }
        }
    }

    if (deeper !== 0) {
        throw new Error('@bem/sdk.naming.cell.pattern-parser: Unclosed parenthesis in path pattern');
    }

    lastPush < pattern.length && separation.push(pattern.slice(lastPush));

    return separation;
};
