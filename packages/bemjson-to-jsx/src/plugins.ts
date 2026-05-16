import { camelCase } from 'change-case';

import type { BemEntityName } from '@bem/sdk.entity-name';
import { BemEntityName as BemEntityNameClass } from '@bem/sdk.entity-name';

import { styleToObj, valToStr, type StyleObject } from './helpers.js';
import type { BemJson, JSXNode } from './types.js';

export type Plugin = (jsx: JSXNode, bemjson: BemJson) => string | undefined | void;
export type PluginFactory = () => Plugin;

export const copyMods: PluginFactory = () => (jsx, bemjson) => {
  if (typeof bemjson !== 'object' || bemjson === null || Array.isArray(bemjson)) return;
  if (bemjson.elem) {
    if (bemjson.elemMods) Object.assign(jsx.props, bemjson.elemMods);
  } else if (bemjson.mods) {
    Object.assign(jsx.props, bemjson.mods);
  }
};

export const camelCaseProps: PluginFactory = () => (jsx) => {
  jsx.props = Object.keys(jsx.props).reduce<Record<string, unknown>>(
    (acc, key) => {
      acc[camelCase(key)] = jsx.props[key];
      return acc;
    },
    {},
  );
};

const CUSTOM_BLACKLIST = new Set(['content', 'block', 'elem', 'mods', 'elemMods', 'tag', 'js']);

export const copyCustomFields: PluginFactory = () => (jsx, bemjson) => {
  if (typeof bemjson !== 'object' || bemjson === null || Array.isArray(bemjson)) return;

  for (const key of Object.keys(bemjson)) {
    if (CUSTOM_BLACKLIST.has(key)) continue;

    const value = (bemjson as Record<string, unknown>)[key];

    if (key === 'attrs' && value && typeof value === 'object' && !Array.isArray(value)) {
      const style = (value as Record<string, unknown>)['style'];
      if (style !== undefined) jsx.props['style'] = style;
    }

    jsx.props[key] = value;
  }
};

export const stylePropToObj: PluginFactory = () => (jsx) => {
  const style = jsx.props['style'];
  if (style === undefined) return;

  const obj: StyleObject = styleToObj(style as string | StyleObject);
  jsx.props['style'] = obj;

  const attrs = jsx.props['attrs'];
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    (attrs as Record<string, unknown>)['style'] = obj;
  }
};

export const keepWhiteSpaces: PluginFactory = () => (jsx) => {
  if (!jsx.isText) return;
  const text = jsx.simpleText;
  if (text.startsWith(' ') || text.endsWith(' ')) {
    jsx.simpleText = `{${valToStr(text)}}`;
  }
};

export interface WhiteListOptions {
  entities?: BemEntityName[];
}

export const whiteList = (options: WhiteListOptions = {}): Plugin => (jsx) => {
  if (options.entities && jsx.bemEntity) {
    const entity = jsx.bemEntity;
    const allowed = options.entities.some((white) =>
      BemEntityNameClass.create(white).isEqual(entity),
    );
    if (!allowed) return '';
  }
  return undefined;
};

export const defaultPlugins: PluginFactory[] = [
  keepWhiteSpaces,
  copyMods,
  camelCaseProps,
  copyCustomFields,
  stylePropToObj,
];
