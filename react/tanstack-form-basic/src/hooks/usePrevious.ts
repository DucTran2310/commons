import { useEffect, useRef } from "react";

/**
 * Lưu lại giá trị trước đó của 1 biến bất kỳ
 * @param value - giá trị hiện tại
 * @returns previous value
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
