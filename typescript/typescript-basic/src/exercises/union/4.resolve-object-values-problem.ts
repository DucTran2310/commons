import { Equal, Expect } from "@/type-utils";

export const notification = {
  ALERT: "alert",
  WARNING: "warning",
  DANGER: "danger",
} as const;
type Notification = typeof notification;
type NotificationAlert = Notification["ALERT"];
type tests = [Expect<Equal<NotificationAlert, "alert">>];
