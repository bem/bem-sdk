import { parseXamel, type XamelNode } from '../xamel.js';

export type ParsedXmlEntry = [string | Record<string, ParsedXmlEntry[]>, string?];

export async function parseEnbXml(str: string): Promise<ParsedXmlEntry[]> {
  if (!str.includes('<i18n:')) return [[str]];

  const xml = await parseXamel(str, { strict: false, trim: false });
  return processNodes((xml.children ?? []) as Array<XamelNode | string>);
}

async function processNodes(
  nodes: Array<XamelNode | string>,
): Promise<ParsedXmlEntry[]> {
  const acc: ParsedXmlEntry[] = [];
  const unknown: XamelNode[] = [];

  for (const node of nodes) {
    if (typeof node === 'string') {
      acc.push([node]);
      continue;
    }

    if (node.name === 'I18N:DYNAMIC') {
      const key = node.attrs?.['KEY'];
      if (key === 'plural' || key === 'plural_adv') {
        const pluralNode = await transformPlural(node);
        acc.push([pluralNode]);
      }
      continue;
    }

    if (node.name === 'I18N:PARAM') {
      acc.push([transformParam(node), extractText(node)]);
      continue;
    }

    if (process.env['DEBUG']) {
      console.log('need transform:');
      console.log(node);
      unknown.push(node);
    }
  }

  if (unknown.length) {
    throw unknown;
  }

  return acc;
}

async function transformPlural(
  node: XamelNode,
): Promise<Record<string, ParsedXmlEntry[]>> {
  const pluralObj: Record<string, ParsedXmlEntry[]> = {};
  const children = (node.children ?? []) as Array<XamelNode | string>;

  for (const child of children) {
    if (typeof child === 'string') continue;
    for (const type of ['one', 'some', 'many', 'none']) {
      if (child.name === `I18N:${type.toUpperCase()}`) {
        try {
          pluralObj[type] = await processNodes(
            (child.children ?? []) as Array<XamelNode | string>,
          );
        } catch (err) {
          console.log('Failed to process nodes');
          console.log(err);
        }
      }
    }
  }

  return pluralObj;
}

function transformParam(node: XamelNode): string {
  return `{${extractText(node)}}`;
}

function extractText(node: XamelNode): string {
  return node.$('text()');
}
