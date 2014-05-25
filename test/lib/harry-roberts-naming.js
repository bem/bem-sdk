var BEMNaming = require('../../lib/bem-naming').BEMNaming;

module.exports = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });
