import { INamingConvention } from '@bem/sdk.naming.presets';
import { IOptions } from '@bem/sdk.entity-name';

export type Stringify = (entity: IOptions) => string;
export default function stringifyWrapper(convention: INamingConvention): Stringify;
