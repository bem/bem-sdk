import {
  patternParser,
  type PatternSeparation,
} from '@bem/sdk.naming.cell.pattern-parser';

export interface PathPlaceholders {
  layer: string;
  tech?: string;
  entity: string;
  [key: string]: string | undefined;
}

export type PathStringify = (parts: PathPlaceholders) => string;

export function buildPathStringify(
  pattern: string,
  defaultLayer?: string,
): PathStringify {
  const separation = patternParser(pattern);

  return (parts) => {
    const out: string[] = [];

    const join = (frame: PatternSeparation, j: number): void => {
      for (let i = 0; i < frame.length - j; i += 1) {
        const el = frame[i + j];
        if (i % 2 === 0) {
          out.push(el as string);
        } else if (Array.isArray(el)) {
          const key = el[0] as string;
          const value = parts[key];
          if (value && (key !== 'layer' || value !== defaultLayer)) {
            join(el, 1);
          }
        } else {
          out.push(parts[el as string] ?? '');
        }
      }
    };

    join(separation, 0);
    return out.join('');
  };
}
