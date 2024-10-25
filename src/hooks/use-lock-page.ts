/** @format */

import { useCallback, useEffect } from "react";

const useLockPage = () => {
  const lockScroll = useCallback(() => {
    const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarCompensation}px`;
    document.body.style.paddingRight = "var(--scrollbar-compensation)";
    document.body.dataset["scrollLock"] = "true";
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    delete document.body.dataset["scrollLock"];
  }, []);

  useEffect(() => {
    const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
    document.body.style.setProperty(
      "--scrollbar-compensation",
      `${scrollBarCompensation}px`
    );
  }, []);

  return { lockScroll, unlockScroll };
};

export { useLockPage };
