'use strict';

const fs = require('fs');
const vm = require('vm');
const minimist = require('minimist');
const path = require('path');
const join = path.join;
const osHomedir = require('os-homedir');

function getEnv(prefix, env) {
    env || (env = process.env);

    const obj = {};
    const prefixLength = prefix.length;

    Object.keys(env)
        .filter(function(key) { return key.indexOf(prefix) === 0; })
        .forEach(function(key) {
            let keypath = key.substring(prefixLength).split('__');

            // Trim empty strings from keypath array
            let _emptyStringIndex;
            while ((_emptyStringIndex = keypath.indexOf('')) > -1) {
                keypath.splice(_emptyStringIndex, 1);
            }

            let cursor = obj;

            keypath.forEach(function _buildSubObj(_subkey, idx) {
                // (check for _subkey first so we ignore empty strings)
                // (check for cursor to avoid assignment to primitive objects)
                if (!_subkey || typeof cursor !== 'object') { return; }

                // If this is the last key, just stuff the value in there
                // Assigns actual value from env variable to final key
                // (unless it's just an empty string- in that case use the last valid key)
                if (idx === keypath.length - 1) {
                    cursor[_subkey] = env[key];
                }

                // Build sub-object if nothing already exists at the keypath
                if (typeof cursor[_subkey] === 'undefined') {
                    cursor[_subkey] = {};
                }

                // Increment cursor used to track the object at the current depth
                cursor = cursor[_subkey];
            });
        });

    return obj;
}

function findAllConfigs(start, rel, fsRoot) {
    const found = [];

    do {
        const file = path.join(start, rel);

        (fs.existsSync(file) || fs.existsSync(file + '.json')) && found.push(file);
        start = path.dirname(start);
    } while (fsRoot ? start === fsRoot : path.dirname(start) !== start); // root

    return found;
}

module.exports = function(options) {
    // TODO: get rid of minimist
    const name = options.name;
    const argv = options.argv || minimist(process.argv.slice(2));
    const env = getEnv(name + '_');
    const configs = [];
    const configFiles = [];
    const home = options.fsHome || osHomedir();

    function addConfigFile(file) {
        if (configFiles.indexOf(file) >= 0) { return; }

        let fileConfig;
        let parsedConfig;

        try {
            parsedConfig = require(file);
        } catch (err) {
            //
        }

        if (!parsedConfig) {
            try {
                fileConfig = fs.readFileSync(file, 'utf-8');
                fileConfig && (parsedConfig = vm.runInNewContext('(' + fileConfig + ')'));
            } catch (err) {
                //
            }
        }

        if (parsedConfig) {
            parsedConfig.__source = file;
            configs.push(parsedConfig);
            configFiles.push(file);
        }
    }

    home && [
        join(home, '.config', name, 'config'),
        join(home, '.config', name),
        join(home, '.' + name, 'config'),
        join(home, '.' + name + 'rc')
    ].forEach(addConfigFile);

    findAllConfigs(options.projectRoot, '.' + name + 'rc', options.fsRoot).forEach(addConfigFile);

    env.config && addConfigFile(env.config);
    argv.config && addConfigFile(argv.config);

    return [options.defaults || {}].concat(configs, Object.keys(env).length ? env : []);
}
