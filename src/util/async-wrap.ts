import React from "react";

type AsyncWrap = <T>(
  setState: React.Dispatch<React.SetStateAction<T>>
) => (state: T) => void;

/**
 * Provides a wrapper function that allows React.useState setter functions to be called securely in asynchronous functions.
 * It prevents errors in case the component has unmounted while the asynchronous function was waiting to be executed.
 */
export function useAsyncWrap(): AsyncWrap {
  const isMountedRef = React.useRef(true);

  React.useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  return React.useCallback<AsyncWrap>(
    (setState) => (state) => {
      if (isMountedRef.current) setState(state);
    },
    []
  );
}
