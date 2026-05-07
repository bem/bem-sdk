export interface NamingDelims {
  elem: string;
  mod: string | { name: string; val: string };
}

export interface FsConvention {
  pattern: string;
  scheme: string;
  delims?: Partial<NamingDelims>;
}

export interface NamingConvention {
  delims: { elem: string; mod: { name: string; val: string } };
  fs: FsConvention;
  wordPattern: string;
}
