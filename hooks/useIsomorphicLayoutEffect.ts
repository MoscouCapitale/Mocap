import { useEffect, useLayoutEffect } from "preact/hooks";

export const useIsomorphicLayoutEffect = typeof globalThis !== "undefined" ? useLayoutEffect : useEffect;
