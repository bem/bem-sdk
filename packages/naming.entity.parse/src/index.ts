import { BemEntityName } from '@bem/sdk.entity-name';
import type { NamingConvention } from '@bem/sdk.naming.presets';

export type EntityParse = (str: string) => BemEntityName | undefined;

/**
 * Builds the regex describing one BEM entity for a given naming convention.
 *
 * The regex has two alternative branches:
 *   1. block(modName(modVal)?)?           — block or block + mod
 *   2. block(elem)(modName(modVal)?)?     — elem or elem + mod
 *
 * Capture groups (1-based):
 *   block-branch:  1=block        2=modName  3=modVal
 *   elem-branch:   4=block  5=elem  6=modName  7=modVal
 */
function buildRegex(
  delims: NamingConvention['delims'],
  wordPattern: string,
): RegExp {
  const block = `(${wordPattern})`;
  const elem = `(?:${delims.elem}(${wordPattern}))?`;
  const modName = `(?:${delims.mod.name}(${wordPattern}))?`;
  const modVal = `(?:${delims.mod.val}(${wordPattern}))?`;
  const mod = modName + modVal;

  return new RegExp(`^${block}${mod}$|^${block}${elem}${mod}$`);
}

function parse(str: string, regex: RegExp): BemEntityName | undefined {
  const executed = regex.exec(str);
  if (!executed) return undefined;

  const block = executed[1] ?? executed[4];
  if (!block) return undefined;

  const elem = executed[5];
  const modName = executed[2] ?? executed[6];
  const modVal = executed[3] ?? executed[7];

  return new BemEntityName({
    block,
    ...(elem ? { elem } : {}),
    ...(modName
      ? { mod: { name: modName, val: modVal ?? true } }
      : {}),
  });
}

/**
 * Creates a `parse` function for a specified naming convention.
 *
 * @param convention - naming convention (delims + wordPattern).
 * @returns parser turning a BEM string into `BemEntityName | undefined`.
 */
export function bemNamingEntityParse(
  convention: Pick<NamingConvention, 'delims' | 'wordPattern'>,
): EntityParse {
  const regex = buildRegex(convention.delims, convention.wordPattern);
  return (str) => parse(str, regex);
}

export default bemNamingEntityParse;
