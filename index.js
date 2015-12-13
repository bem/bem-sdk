Object.assign || (Object.assign = require('object-assign'));

var path = require('path'),
    tilde = require('os-homedir')(),
    findConfig = require('find-config');

function getConfigName(isGlobal) {
    return (isGlobal ? '.' : '') + 'bemconf';
}

module.exports = function(config) {
    var localConfig = {},
        cwd = process.cwd();

    do {
        cwd = path.resolve(cwd, '..');
        Object.assign(localConfig,
            findConfig.require(getConfigName(), { cwd: cwd, home: false }));
    } while(!localConfig.root && cwd !== '/');

    if (localConfig.root) localConfig.root = cwd;

    var globalConfig = {};
    try {
        globalConfig = require(path.join(tilde, getConfigName(true)));
    } catch(e) {}

    var extendedConfig = Object.assign({}, globalConfig, localConfig, config);

    return {
        global: globalConfig,
        local: localConfig,
        extended: extendedConfig
    };
};

module.exports.getConfigName = getConfigName;
