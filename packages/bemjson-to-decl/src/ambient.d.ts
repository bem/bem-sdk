declare module 'stringify-object' {
  interface StringifyOptions {
    indent?: string;
    singleQuotes?: boolean;
    inlineCharacterLimit?: number;
    transform?: (
      object: object | unknown[],
      property: string | number,
      originalResult: string,
    ) => string;
    filter?: (object: object | unknown[], property: string | number) => boolean;
  }
  function stringifyObject(
    input: unknown,
    options?: StringifyOptions,
    pad?: string,
  ): string;
  export default stringifyObject;
}
