type ReplaceSpaceWithDash<T extends string> =
  T extends `${infer L}${" "}${infer R}` ? `${L}-${R}` : T;
type Name = ReplaceSpaceWithDash<"Emmylou Harris">;
//   ^? "Emmylou-Harris"

type Replace<
  T extends string,
  From extends string,
  To extends string
> = T extends `${infer L}${From}${infer R}` ? `${L}${To}${R}` : T;

type DashName = Replace<"Matt Pocock", " ", "-">;
//   ^? "Matt-Pocock"

type StringReplace<
  T extends string,
  From extends string,
  To extends string
> = T extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${StringReplace<Suffix, From, To>}`
  : T;

type Result = StringReplace<"Evondev Frontend Dev Js Ts", " ", "-">;
//   ^? "Evondev-Frontend-Dev-Js-Ts
