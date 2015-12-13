var CONF_NAME = 'bemconf.json',
    path = require('path'),
    mock = require('mock-fs'),
    expect = require('chai').expect,
    findConfigPath = require.resolve('find-config'),
    osHomedirPath = require.resolve('os-homedir'),
    bemConfigPath = require.resolve('..'),
    tilde = require(osHomedirPath)(),
    globalConfigPath = path.join(tilde, '.' + CONF_NAME);

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

    it('should return global config', function() {
        var scheme = {};
        scheme[globalConfigPath] = '{ "GLOBAL": "1" }';
        mock(scheme);
        var config = require('..');

        expect({
            global: { GLOBAL: '1' },
            local: {},
            extended: { GLOBAL: '1' }
        }).eql(config());
    });

    it('should respect local config', function() {
        var scheme = {};
        scheme[globalConfigPath] = '{ "GLOBAL": "1" }';
        scheme[CONF_NAME] = '{ "LOCAL": "1" }';

        mock(scheme);
        var config = require('..');

        expect({
            global: { GLOBAL: '1' },
            local: { LOCAL: '1' },
            extended: { GLOBAL: '1', LOCAL: '1' }
        }).eql(config());
    });

    it('should override config with option argument', function() {
        var scheme = {};
        scheme[globalConfigPath] = '{ "GLOBAL": "1" }';
        scheme[CONF_NAME] = '{ "LOCAL": "1" }';
        mock(scheme);
        var config = require('..');

        expect({
            global: { GLOBAL: '1' },
            local: { LOCAL: '1' },
            extended: { GLOBAL: '1', LOCAL: '1', OPTION: '1' }
        }).eql(config({ OPTION: '1'}));
    });
});

