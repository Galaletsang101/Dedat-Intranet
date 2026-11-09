import { useEffect, useState } from "react";

/*
 * Delays updating the returned value until `delayMs` has passed without
 * `value` changing again - used on search inputs so every keystroke
 * doesn't fire a new API request.
 */
export default function useDebouncedValue(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
