'use strict';

module.exports = {
    format: () => { throw new Error('Format method is not implemented for v2 format') },
    parse: () => { throw new Error('Parse method is not implemented for v2 format') }
};
