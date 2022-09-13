import { useCallback, useEffect, useRef } from "react";

export const useBlockScroll = (visible: boolean) => {
  const domProperties = useRef({ overflowY: "auto" });
  const scroll = useRef(0);

  const block = useCallback(() => {
    const ref = domProperties.current;
    if (visible) {
      scroll.current = document.documentElement.scrollTop;
      document.body.style.overflowY = "hidden";
      document.documentElement.style.overflowY = "hidden";
    } else {
      ref.overflowY = document.body.style.overflowY;
      document.body.style.overflowY = ref.overflowY;
      document.documentElement.style.overflowY = ref.overflowY;
      document.documentElement.scroll({ top: scroll.current });
    }
    return ref;
  }, [visible]);

  useEffect(() => {
    const ref = block();
    return () => {
      document.body.style.overflowY = ref.overflowY;
      document.documentElement.style.overflowY = ref.overflowY;
    };
  }, [block]);
};
