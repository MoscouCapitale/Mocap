import { useCallback, useEffect, useState } from "preact/hooks";

export const useIsMobile = (mobileScreenSize = 768) => {

  const windowGlobal = typeof globalThis.matchMedia === "function" ? globalThis : window;

  if (!windowGlobal || typeof windowGlobal === "undefined" || typeof windowGlobal.matchMedia === "undefined") {
    return false;
  }

  const [isMobile, setIsMobile] = useState(windowGlobal.matchMedia(`(max-width: ${mobileScreenSize}px)`).matches);

  const checkIsMobile = useCallback((event: MediaQueryListEvent) => {
    setIsMobile(event.matches);
  }, []);

  useEffect(() => {
    const mediaListener = windowGlobal.matchMedia(`(max-width: ${mobileScreenSize}px)`);
    // try catch used to fallback for browser compatibility
    try {
      mediaListener.addEventListener("change", checkIsMobile);
    } catch {
      mediaListener.addListener(checkIsMobile);
    }

    return () => {
      try {
        mediaListener.removeEventListener("change", checkIsMobile);
      } catch {
        mediaListener.removeListener(checkIsMobile);
      }
    };
  }, [mobileScreenSize]);

  return isMobile;
};
