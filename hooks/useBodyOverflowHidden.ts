import { useEffect } from "react";

let lockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

export function useBodyOverflowHidden(returnFocus: boolean = true) {
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (scrollbarWidth > 0) {
        const existingPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.paddingRight = `${existingPadding + scrollbarWidth}px`;
      }

      document.body.style.overflow = "hidden";
    }

    lockCount++;

    return () => {
      lockCount--;

      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }

      if (returnFocus) {
        previousActiveElement?.focus();
      }
    };
  }, [returnFocus]);
}