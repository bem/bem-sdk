module.exports = [
    {
        block: 'b1',
        attrs: {
            foo: {
                block: 'b1',
                elem: 'e1',
                elemMods: {m1: 'v1'},
                attrs: {
                    bar: [{
                        block: 'b11',
                        mods: {m1: 'v1'}
                    }]
                }
            }
        }
    },
    {
        block: 'b2',
        js: {
            foo: [{
                block: 'b2',
                elem: 'e2',
                elemMods: {m2: 'v2'},
                js: {
                    bar: {
                        block: 'b22',
                        mods: {m2: 'v2'}
                    }
                }
            }]
        }
    }
];
