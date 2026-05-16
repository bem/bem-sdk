import { pascalCase } from 'change-case';

import { BemEntityName } from '@bem/sdk.entity-name';
import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
import { create as createNamingPreset } from '@bem/sdk.naming.presets';
import type { CreateOptions } from '@bem/sdk.naming.presets';

import { styleToObj, valToStr } from './helpers.js';
import * as pluginsApi from './plugins.js';
import { defaultPlugins, type Plugin } from './plugins.js';
import { REACT_TAGS } from './react-mappings.js';
import type { BemJson, BemJsonObject, JSXNode } from './types.js';

export type { BemJson, BemJsonObject, JSXNode } from './types.js';
export type { Plugin, PluginFactory, WhiteListOptions } from './plugins.js';
export { pluginsApi as plugins };

export interface TransformerOptions {
  /** Naming preset (string preset name or `CreateOptions`). Default: 'react'. */
  naming?: CreateOptions | string;
}

export interface ProcessResult {
  bemjson: BemJson;
  tree: JSXNodeImpl[] | JSXNodeImpl;
  readonly JSX: string;
}

class JSXNodeImpl implements JSXNode {
  tag = 'div';
  props: Record<string, unknown> = {};
  children: JSXNodeImpl[] | JSXNodeImpl | undefined = [];
  bemEntity: BemEntityName | null = null;
  isText = false;
  simpleText = '';

  toString(): string {
    if (this.isText) return this.simpleText;

    const tag = tagToClass(this.tag);

    const raw = this.children;
    const childArr: JSXNodeImpl[] = raw == null
      ? []
      : Array.isArray(raw)
        ? raw
        : [raw];
    const children = childArr
      .filter(Boolean)
      .filter((child) => !(child.isText && child.simpleText === ''));

    const propsStr = propsToStr(this.props);

    return children.length
      ? `<${tag}${propsStr}>\n${children.join('\n')}\n</${tag}>`
      : `<${tag}${propsStr}/>`;
  }
}

function propsToStr(props: Record<string, unknown>): string {
  return Object.keys(props).reduce((acc, k) => {
    const v = props[k];
    if (typeof v === 'string') return `${acc} ${k}=${valToStr(v)}`;
    if (v instanceof JSXNodeImpl) return `${acc} ${k}={${render(v)}}`;
    return `${acc} ${k}={${valToStr(v)}}`;
  }, '');
}

/**
 * Returns native HTML/SVG element name as-is, otherwise PascalCases for use
 * as a React component identifier (`my-block` -> `MyBlock`).
 */
export function tagToClass(tag: string): string {
  return REACT_TAGS.has(tag) ? tag : pascalCase(tag);
}

function render(tree: JSXNodeImpl[] | JSXNodeImpl): string {
  return Array.isArray(tree) ? tree.join('\n') : tree.toString();
}

interface QueueItem {
  json: BemJson;
  id: number | 'children';
  blockName: string;
  tree: JSXNodeImpl[] | JSXNodeImpl;
}

export class Transformer {
  /** @internal */
  private pluginsList: Plugin[] = [];

  /** @internal */
  private readonly bemNaming: (entity: { block: string; elem?: string; mod?: { name: string; val?: string | boolean } }) => string;

  /** Re-export for users who imported `Transformer.Transformer` historically. */
  Transformer: typeof Transformer = Transformer;

  constructor(options: TransformerOptions = {}) {
    this.use(defaultPlugins.map((factory) => factory()));
    this.bemNaming = stringifyWrapper(createNamingPreset(options.naming ?? 'react'));
  }

  use(...args: Array<Plugin | Plugin[]>): this {
    for (const arg of args) {
      if (Array.isArray(arg)) this.pluginsList.push(...arg);
      else this.pluginsList.push(arg);
    }
    return this;
  }

  process(bemjson: BemJson): ProcessResult {
    const root: QueueItem = { json: bemjson, id: 0, blockName: '', tree: [] };
    const queue: QueueItem[] = [root];

    let node: QueueItem | undefined;

    const setJsx = (json: BemJson): JSXNodeImpl => {
      const jsx = new JSXNodeImpl();
      const blockName =
        (typeof json === 'object' && !Array.isArray(json) && json.block) ||
        (node ? node.blockName : '');

      if (typeof json === 'string') {
        jsx.isText = true;
        jsx.simpleText = json;
        return jsx;
      }

      if (Array.isArray(json)) return jsx;

      if (json.tag) {
        jsx.tag = json.tag;
      } else if (json.block || json.elem) {
        jsx.bemEntity = new BemEntityName({
          block: blockName,
          ...(json.elem ? { elem: json.elem } : {}),
        });
        jsx.tag = this.bemNaming(jsx.bemEntity.valueOf());
      }

      return jsx;
    };

    while ((node = queue.shift())) {
      const json = node.json;

      if (Array.isArray(json)) {
        for (let i = 0; i < json.length; i++) {
          queue.push({ json: json[i] as BemJson, id: i, tree: node.tree, blockName: node.blockName });
        }
        continue;
      }

      const blockName =
        (typeof json === 'object' && json.block) || node.blockName;

      const jsx = setJsx(json);

      // Materialise nested entity-shaped props as JSX children-of-prop.
      if (typeof json === 'object' && !Array.isArray(json)) {
        for (const key of Object.keys(json)) {
          if (key === 'mix' || key === 'content' || key === 'attrs') continue;
          const value = (json as Record<string, unknown>)[key];
          if (value && typeof value === 'object' && typeof (value as { block?: unknown }).block === 'string') {
            const nestedJSX = setJsx(value as BemJson);
            for (const plugin of this.pluginsList) {
              plugin(nestedJSX, { block: (value as BemJsonObject).block, ...(value as BemJsonObject) });
            }
            (json as Record<string, unknown>)[key] = nestedJSX;
          }
        }
      }

      let res: BemJson | undefined | string;
      const jsonForPlugin: BemJsonObject =
        typeof json === 'object' && !Array.isArray(json)
          ? { block: blockName, ...(json as BemJsonObject) }
          : ({ block: blockName } as BemJsonObject);

      for (const plugin of this.pluginsList) {
        const r = plugin(jsx, jsonForPlugin);
        if (r !== undefined) {
          res = r;
          node.json = r as BemJson;
          node.blockName = blockName as string;
          queue.push(node);
          break;
        }
      }

      if (res === undefined) {
        const content =
          typeof json === 'object' && !Array.isArray(json)
            ? (json.content as BemJson | undefined)
            : undefined;

        if (content) {
          if (Array.isArray(content)) {
            // Flatten arbitrarily nested arrays.
            let arr: BemJson[] = content;
            let needsFlatten = true;
            while (needsFlatten) {
              needsFlatten = false;
              for (const item of arr) {
                if (Array.isArray(item)) {
                  needsFlatten = true;
                  break;
                }
              }
              if (needsFlatten) {
                arr = ([] as BemJson[]).concat(...(arr as BemJson[][]));
              }
            }
            (json as BemJsonObject).content = arr;
            // Children are an array — initialise jsx.children as an array
            // so subsequent assignments append correctly.
            jsx.children = [];
            for (let i = 0; i < arr.length; i++) {
              queue.push({
                json: arr[i] as BemJson,
                id: i,
                tree: jsx.children,
                blockName: blockName as string,
              });
            }
          } else {
            queue.push({
              json: content,
              id: 'children',
              tree: jsx,
              blockName: blockName as string,
            });
          }
        } else {
          jsx.children = undefined;
        }
      }

      // Mirror legacy `node.tree[node.id] = jsx` behaviour:
      // - tree is an array  -> tree[i] = jsx
      // - tree is a JSXNode -> tree.children = jsx (single child case)
      if (Array.isArray(node.tree)) {
        node.tree[node.id as number] = jsx;
      } else {
        (node.tree as unknown as Record<string, JSXNodeImpl>)[
          node.id as string
        ] = jsx;
      }
    }

    return {
      bemjson: root.json,
      tree: root.tree,
      get JSX() {
        return render(root.tree);
      },
    };
  }
}

/**
 * Creates a configured `Transformer`. Mirrors the legacy default-export
 * factory from CommonJS (`require('@bem/sdk.bemjson-to-jsx')(opts)`).
 */
function bemjsonToJsxImpl(options: TransformerOptions = {}): Transformer {
  return new Transformer(options);
}

interface BemjsonToJsxFactory {
  (options?: TransformerOptions): Transformer;
  tagToClass: typeof tagToClass;
  plugins: typeof pluginsApi;
  styleToObj: typeof styleToObj;
}

export const bemjsonToJsx: BemjsonToJsxFactory = Object.assign(bemjsonToJsxImpl, {
  tagToClass,
  plugins: pluginsApi,
  styleToObj,
});

export { styleToObj } from './helpers.js';
export default bemjsonToJsx;
