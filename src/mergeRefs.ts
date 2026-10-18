import { useCallback, type Ref } from "react";

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
}

/** Combines object and callback refs into one stable callback ref. */
export function useMergedRefs<T>(...refs: (Ref<T> | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((value: T | null) => {
    for (const ref of refs) setRef(ref, value);
  }, refs);
}
