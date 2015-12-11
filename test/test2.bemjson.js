module.exports = {
    block: 'b1',
    content: [
        {
            elem: 'e1'
        },
        {
            elem: 'e1',
            elemMods: { m1: 'v1' }
        },
        {
            elem: 'e1',
            mods: { m1: 'v2' }
        },
        {
            block: 'b1',
            elem: 'e1'
        },
        {
            elem: 'e1',
            mods: { m2: true }
        }
    ]
};
