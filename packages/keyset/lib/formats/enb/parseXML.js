import { XMLParser } from 'fast-xml-parser';

export default async function transform(str) {

    if (!str.includes('<i18n:')) {
        return [[str]];
    }

    // Wrap in a root element so the parser handles it as valid XML
    const wrappedStr = `<root>${str}</root>`;

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        preserveOrder: true,
        trimValues: false,
        textNodeName: '#text',
        processEntities: false,
        // Treat i18n: prefixed tags properly
        allowBooleanAttributes: true
    });

    const parsed = parser.parse(wrappedStr);
    // parsed is an array, root element is first
    const rootChildren = parsed[0].root;

    const transformed = await processNodes(rootChildren);

    return transformed;
}


async function processNodes(nodes) {
    const unknown = [];
    const transformed = [];

    for (const node of nodes) {
        // Text node
        if (typeof node['#text'] === 'string' || typeof node['#text'] === 'number') {
            transformed.push([String(node['#text'])]);
            continue;
        }

        const nodeName = getNodeName(node);
        if (!nodeName) continue;

        const upperName = nodeName.toUpperCase();

        if (upperName === 'I18N:DYNAMIC') {
            const attrs = getNodeAttrs(node, nodeName);
            const key = attrs.key || attrs.KEY;

            if (key === 'plural' || key === 'plural_adv') {
                const children = getNodeChildren(node, nodeName);
                const pluralNode = await transformPlural(children);
                transformed.push([pluralNode]);
            }

            continue;
        }

        if (upperName === 'I18N:PARAM') {
            const textContent = extractText(node, nodeName);
            transformed.push([
                `{${textContent}}`,
                textContent
            ]);
            continue;
        }

        if (process.env.DEBUG) {
            console.log('need transform:');
            console.log(node);
            unknown.push(node);
        }
    }

    if (unknown.length) {
        throw unknown;
    }

    return transformed;
}

async function transformPlural(children) {
    const pluralObj = {};

    for (const node of children) {
        const nodeName = getNodeName(node);
        if (!nodeName) continue;

        const upperName = nodeName.toUpperCase();

        for (const type of ['one', 'some', 'many', 'none']) {
            if (upperName === `I18N:${type.toUpperCase()}`) {
                try {
                    const nodeChildren = getNodeChildren(node, nodeName);
                    pluralObj[type] = await processNodes(nodeChildren);
                } catch(err) {
                    console.log('Failed to process nodes');
                    console.log(err);
                }
            }
        }
    }

    return pluralObj;
}

// Helper: get the element name from a fast-xml-parser preserveOrder node
function getNodeName(node) {
    for (const key of Object.keys(node)) {
        if (key !== '#text' && key !== ':@') {
            return key;
        }
    }
    return null;
}

// Helper: get attributes from a preserveOrder node
function getNodeAttrs(node, nodeName) {
    if (node[':@']) {
        return node[':@'];
    }
    return {};
}

// Helper: get children array from a preserveOrder node
function getNodeChildren(node, nodeName) {
    return node[nodeName] || [];
}

// Helper: extract text content from a node (like xamel's .$('text()'))
function extractText(node, nodeName) {
    const children = node[nodeName] || [];
    let text = '';
    for (const child of children) {
        if (typeof child['#text'] === 'string' || typeof child['#text'] === 'number') {
            text += String(child['#text']);
        }
    }
    return text;
}
