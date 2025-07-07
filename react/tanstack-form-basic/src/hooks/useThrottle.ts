import { useRef } from "react";
import { throttle } from "lodash";

export const useThrottle = (fn: (...args: any[]) => void, delay: number) => {
  return useRef(throttle(fn, delay)).current;
};
