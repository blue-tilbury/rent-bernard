import { useEffect, useRef } from "react";

export const useOutsideClick = (callback: (value: boolean) => void, value: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUserMenuOpen = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        callback(value);
      }
    };
    document.body.addEventListener("mousedown", handleUserMenuOpen);

    return () => document.body.removeEventListener("mousedown", handleUserMenuOpen);
  }, [callback, value]);

  return ref;
};
