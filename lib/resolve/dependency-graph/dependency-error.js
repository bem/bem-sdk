'use strict';

const util = require('util');
const stringifyEntity = require('bem-naming').stringify;

function DependencyError(loop) {
    // error details
	this.name = 'DependencyError';
    this.loop = loop;
	this.message = 'dependency graph has circular dependencies (' + stringifyLoop(loop) + ').';

    // include stack trace in error object
	Error.captureStackTrace(this, this.constructor);
}

util.inherits(DependencyError, Error);

module.exports = DependencyError;

function stringifyLoop(loop) {
	return loop.map(function (item) {
		var key = stringifyEntity(item.entity),
			tech = item.tech;

		if (tech) {
			return key + '.' + tech;
		}

		return key;
	}).join(' <- ');
}
