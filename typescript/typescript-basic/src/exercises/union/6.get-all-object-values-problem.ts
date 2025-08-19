import { Equal, Expect } from "@/type-utils";

export const notification = {
  ALERT: "alert",
  WARNING: "warning",
  DANGER: "danger",
} as const;

type NotificationKeys = keyof typeof notification;
type Notification = (typeof notification)[NotificationKeys];
type tests = [Expect<Equal<Notification, "alert" | "warning" | "danger">>];
