declare module 'node-eval' {
  function nodeEval(
    content: string,
    filename?: string,
    scope?: Record<string, unknown>,
  ): unknown;
  export default nodeEval;
}
