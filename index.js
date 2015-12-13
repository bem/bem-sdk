Object.assign || (Object.assign = require('object-assign'));
const CONF_NAME = 'bemconf';

var path = require('path'),
    tilde = require('os-homedir')(),
    findConfig = require('find-config');

module.exports = function(config) {
    var localConfig = {},
        cwd = process.cwd();

    do {
        cwd = path.resolve(cwd, '..');
        Object.assign(localConfig,
            findConfig.require(CONF_NAME, { cwd: cwd, home: false }));
    } while(!localConfig.root && cwd !== '/');

    if (localConfig.root) localConfig.root = cwd;

    var globalConfig = {};
    try {
        globalConfig = require(path.join(tilde, '.' + CONF_NAME));
    } catch(e) {}

    var extendedConfig = Object.assign({}, globalConfig, localConfig, config);

    return {
        global: globalConfig,
        local: localConfig,
        extended: extendedConfig
    };
};
