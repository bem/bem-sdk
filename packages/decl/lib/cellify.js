'use strict';

const BemCell = require('@bem/sdk.cell');

module.exports = (data) => {
    const arr = Array.isArray(data) ? data : [data];

    return arr.map(BemCell.create);
};
