'use strict';

const xamel = require('xamel');

module.exports = async function transform(str) {

    if (!str.includes('<i18n:')) {
        return [[str]];
    }

     const transformed = await new Promise((res, rej) =>
         xamel.parse(str, { strict: false, trim: false }, async function(err, xml) {
            if (err) {
                console.log('Error while transform XML we didn\'t expect this shit');
                rej(err);
            }

            const _transformed = await processNodes(xml, true);

            res(_transformed);
        })
    );

    return transformed;
}


async function processNodes(nodes) {
    return await new Promise(async (res, rej) => {
        const unknown = [];

        const transformed = await nodes.reduce(async (accP, node) => {
            const acc = await accP;

            if (typeof node === 'string') {
                acc.push([node]);
                return Promise.resolve(acc);
            }

            if (node.name === 'I18N:DYNAMIC') {
                const { KEY } = node.attrs || {};

                if (KEY === 'plural' || KEY === 'plural_adv') {
                    const pluralNode = await transformPlural(node)
                    acc.push([pluralNode]);
                }

                return Promise.resolve(acc);
            }

            if (node.name === 'I18N:PARAM') {
                acc.push([
                    transformParam(node),
                    extractText(node)
                ]);
                return Promise.resolve(acc);
            }

            if (process.env.DEBUG) {
                console.log('need transform:');
                console.log(node);
                unknown.push(node);
            }

            return Promise.resolve(acc);
        }, Promise.resolve([]));

        if (unknown.length) {
            rej(unknown);
        }

        return res(transformed);
    });
}

async function transformPlural({ children = [] }) {

    const pluralObj = {};

    for (let node of children) {
        for (let type of  ['one', 'some', 'many', 'none']) {
            if (node.name === `I18N:${type.toUpperCase()}`) {
                try {
                    pluralObj[type] = await processNodes(node.children);
                } catch(err) {
                    console.log("WTF!!");
                    console.log(err);
                }
            }
        }
    }

    return pluralObj;
}

function transformParam(node) {
    const text = extractText(node);
    return `{${text}}`;
}

function extractText(node) {
    return node.$(`text()`);
}
