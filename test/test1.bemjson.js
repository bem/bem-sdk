module.exports = {
    block: 'b1',
    content: [
        {
            elem: 'e1',
            elemMods: {
                m1: 'v1',
                bool: true
            },
            content: 'blah'
        },
        {
            elem: 'e2',
            content: [
                {
                    block: 'b1',
                    mods: {
                        b1m1: 'v2'
                    }
                },
                {
                    block: 'b3',
                    content: 'blah'
                }
            ]
        },
        {
            block: 'b2',
            content: {
                elem: 'e1Ofb2',
                content: {
                    elem: 'e2Ofb2',
                    content: [
                        {
                            block: 'b1',
                            content: {
                                elem: 'e3'
                            }
                        },
                        {
                            block: 'b1',
                            mods: {
                                b1m1: 'v1'
                            }
                        }
                    ]
                }
            }
        }
    ]
};
