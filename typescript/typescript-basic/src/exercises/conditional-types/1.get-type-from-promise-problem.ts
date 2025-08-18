import { Equal, Expect } from "@/type-utils";

type X = Promise<string>;
type Y = Promise<{ field: number }>;
type Z = Promise<boolean>;

type ResultX = Transform<X>;
type ResultY = Transform<Y>;
type ResultZ = Transform<Z>;

// type Transform<A> = A extends Promise<string> ? string : never;
// type Transform<A> = A extends Promise<{ field: string }> ? string : never;
// type Transform<A> = A extends Promise<boolean> ? boolean : never;

type Transform<A> = A extends Promise<infer A> ? A : never;

type tests = [
  Expect<Equal<ResultX, string>>,
  Expect<Equal<ResultY, { field: number }>>,
  Expect<Equal<ResultZ, boolean>>
];
