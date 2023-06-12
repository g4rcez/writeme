import { useEffect, useRef } from "react";

export const usePrevious = <T extends any>(state: T): T => {
  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};
