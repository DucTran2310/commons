import { Equal, Expect } from "@/type-utils";

export type Ranking =
  | {
      type: "best";
      award: "Gold";
    }
  | {
      type: "good";
      award: "Silver";
    }
  | {
      type: "normal";
      award: "bronze";
    };
type AwardType = Ranking["type"];
type tests = [Expect<Equal<AwardType, "best" | "good" | "normal">>];
