var path = require('path'),
    mock = require('mock-fs'),
    expect = require('chai').expect,
    config = require('..'),
    localConfigName = config.getConfigName() + '.json',
    globalConfigName = config.getConfigName(true) + '.json',
    findConfigPath = require.resolve('find-config'),
    osHomedirPath = require.resolve('os-homedir'),
    // bemConfigPath = require.resolve('..'),
    tilde = require(osHomedirPath)(),
    globalConfigPath = path.join(tilde, globalConfigName);

    require(findConfigPath);
    // require(bemConfigPath);

    var config = require('..');

describe('bem-config tests', function() {

    afterEach(function () {
        mock.restore();
    });

    it('should return empty configs', function() {
        var scheme = {};
        mock(scheme);

        expect({
            global: {},
            local: {},
            extended: {}
        }).eql(config());
    });

    it('should return global config', function() {
        var scheme = {};
        scheme[globalConfigPath] = '{ "GLOBAL": "1" }';
        mock(scheme);

        expect({
            global: { GLOBAL: '1' },
            local: {},
            extended: { GLOBAL: '1' }
        }).eql(config());
    });

    it('should respect local config', function() {
        var scheme = {};
        scheme[globalConfigPath] = '{ "GLOBAL": "1" }';
        scheme[localConfigName] = '{ "LOCAL": "1" }';

        mock(scheme);

        expect({
            global: { GLOBAL: '1' },
            local: { LOCAL: '1' },
            extended: { GLOBAL: '1', LOCAL: '1' }
        }).eql(config());
    });

    it('should override config with option argument', function() {
        var scheme = {};
        scheme[globalConfigPath] = '{ "GLOBAL": "1" }';
        scheme[localConfigName] = '{ "LOCAL": "1" }';
        mock(scheme);

        expect({
            global: { GLOBAL: '1' },
            local: { LOCAL: '1' },
            extended: { GLOBAL: '1', LOCAL: '1', OPTION: '1' }
        }).eql(config({ OPTION: '1'}));
    });
});

