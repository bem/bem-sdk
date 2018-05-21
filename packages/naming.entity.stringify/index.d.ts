declare module '@bem/sdk.naming.entity.stringify' {
    import { INamingConvention } from '@bem/sdk.naming.presets';
    import { EntityName } from '@bem/sdk.entity-name';

    export type Stringify = (entity: EntityName.IOptions) => string;
    export function stringifyWrapper(convention: INamingConvention): Stringify;
}
