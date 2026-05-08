export { format } from './format.js';
export { normalize } from './normalize.js';
export { merge } from './merge.js';
export { subtract } from './subtract.js';
export { intersect } from './intersect.js';
export { parse } from './parse.js';
export { assign } from './assign.js';
export { load } from './load.js';
export { stringify } from './stringify.js';
export { save } from './save.js';
export { cellify } from './cellify.js';
export { detect } from './detect.js';

export type {
  BemDeclFormat,
  ExportType,
  NormalizeOptions,
  StringifyOptions,
} from './types.js';

import { assign } from './assign.js';
import { cellify } from './cellify.js';
import { detect } from './detect.js';
import { format } from './format.js';
import { intersect } from './intersect.js';
import { load } from './load.js';
import { merge } from './merge.js';
import { normalize } from './normalize.js';
import { parse } from './parse.js';
import { save } from './save.js';
import { stringify } from './stringify.js';
import { subtract } from './subtract.js';

export default {
  assign,
  cellify,
  detect,
  format,
  intersect,
  load,
  merge,
  normalize,
  parse,
  save,
  stringify,
  subtract,
};
