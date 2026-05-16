import { sdkWalker } from './sdk.js';
import { nested } from './nested.js';
import { flat } from './flat.js';

export const walkers = {
  sdk: sdkWalker,
  nested,
  flat,
} as const;

export type WalkerName = keyof typeof walkers;
export type { Walker, WalkerInfo, WalkerAdd } from './types.js';
export { sdkWalker, nested, flat };
export default walkers;
