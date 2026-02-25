import BemCell from '@bem/sdk.cell';

export default (data) => {
    const arr = Array.isArray(data) ? data : [data];

    return arr.map(BemCell.create);
};
