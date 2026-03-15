"use client";

import * as React from "react";

export function useKeyboardShortcut(keys: string[], callback: () => void) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const normalized = keys.map((key) => key.toLowerCase());
      const matches =
        normalized.includes(event.key.toLowerCase()) &&
        (normalized.includes("meta") ? event.metaKey : true) &&
        (normalized.includes("ctrl") ? event.ctrlKey : true);

      if (matches) {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [callback, keys]);
}
