var path = require('path'),
    util = require('util'),
    tilde = require('os-homedir')(),
    findConfig = require('find-config');

module.exports = function(config) {
    var localConfig = findConfig.require('.bem/config', { home: false }) || {},
        globalConfig = {};
    try {
        globalConfig = require(path.join(tilde, '.bem', 'config'));
    } catch(e) {}

    var extendedConfig = util._extend({}, globalConfig);

    extendedConfig = util._extend(extendedConfig, localConfig);
    extendedConfig = util._extend(extendedConfig, config || {});

    return {
        global: globalConfig,
        local: localConfig,
        extended: extendedConfig
    };
};
