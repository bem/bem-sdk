var mock = require('mock-fs'),
    expect = require('chai').expect,
    findConfigPath = require.resolve('find-config'),
    osHomedirPath = require.resolve('os-homedir'),
    bemConfigPath = require.resolve('..'),
    tilde = require(osHomedirPath)(),
    rootConfigPath = tilde + '/.bem/config.json';

    require(findConfigPath);
    require(bemConfigPath);

describe('bem-config tests', function() {

    afterEach(function () {
        mock.restore();
    });

    it('should return empty configs', function() {
        var scheme = {};
        mock(scheme);

        var config = require('..');
        expect({
            global: {},
            local: {},
            extended: {}
        }).eql(config());
    });

    it('should return root config', function() {
        var scheme = {};
        scheme[rootConfigPath] = '{ "ROOT": "1" }';
        mock(scheme);
        var config = require('..');

        expect({
            global: { ROOT: '1' },
            local: { ROOT: '1' },
            extended: { ROOT: '1' }
        }).eql(config());
    });

    it('should return local config', function() {
        var scheme = {};
        scheme[rootConfigPath] = '{ "ROOT": "1" }';
        scheme['.bem/config.json'] = '{ "LOCAL": "1" }';

        mock(scheme);
        var config = require('..');

        expect({
            global: { ROOT: '1' },
            local: { LOCAL: '1' },
            extended: { ROOT: '1', LOCAL: '1' }
        }).eql(config());
    });

    it('should return extended config', function() {
        var scheme = {};
        scheme[rootConfigPath] = '{ "ROOT": "1" }';
        scheme['.bem/config.json'] = '{ "LOCAL": "1" }';

        mock(scheme);
        var config = require('..');

        expect({
            global: { ROOT: '1' },
            local: { LOCAL: '1' },
            extended: { ROOT: '1', LOCAL: '1', EXTENDED: '1' }
        }).eql(config({ EXTENDED: '1'}));
    });
});

