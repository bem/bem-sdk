export type PatternSeparation = Array<string | PatternSeparation>;

interface Frame {
  separation: PatternSeparation;
  parentRef?: Frame;
}

const CH_DOLLAR = 36;
const CH_LBRACE = 123;
const CH_RBRACE = 125;
const CH_QUESTION = 63;

export function patternParser(pattern: string): PatternSeparation {
  const root: PatternSeparation = [];
  let ref: Frame = { separation: root };
  let lastPush = 0;
  let deeper = 0;

  const flush = (i: number): void => {
    ref.separation.push(pattern.slice(lastPush, i));
    lastPush = i + 1;
  };

  for (let i = 0, l = pattern.length; i < l; i++) {
    const ch = pattern.charCodeAt(i);

    if (deeper % 2 === 0) {
      // Raw text
      if (deeper > 1 && ch === CH_RBRACE) {
        if (lastPush < i) flush(i);
        else lastPush = i + 1;
        ref.parentRef!.separation.push(ref.separation);
        ref = ref.parentRef!;
        deeper -= 2;
      } else if (ch === CH_DOLLAR && pattern.charCodeAt(i + 1) === CH_LBRACE) {
        flush(i);
        lastPush += 1; // skip '$'
        deeper += 1;
      }
    } else {
      // Variable
      if (ch === CH_QUESTION) {
        ref = { separation: [], parentRef: ref };
        flush(i);
        deeper += 1;
      } else if (ch === CH_RBRACE) {
        flush(i);
        deeper -= 1;
      }
    }
  }

  if (deeper !== 0) {
    throw new Error(
      '@bem/sdk.naming.cell.pattern-parser: Unclosed parenthesis in path pattern',
    );
  }

  if (lastPush < pattern.length) {
    root.push(pattern.slice(lastPush));
  }

  return root;
}

export default patternParser;
