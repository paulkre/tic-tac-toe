import React from "react";

import { Outcome } from "..";

export function getWinningFields(state: Int8Array): number[] | false {
  const getRowIfEqual = (offset: number, stride: number) => {
    const a = offset;
    const b = offset + stride;
    const c = offset + 2 * stride;
    return (
      state[a] !== 0 &&
      state[a] === state[b] &&
      state[a] === state[c] && [a, b, c]
    );
  };

  return (
    getRowIfEqual(0, 1) ||
    getRowIfEqual(3, 1) ||
    getRowIfEqual(6, 1) ||
    getRowIfEqual(0, 3) ||
    getRowIfEqual(1, 3) ||
    getRowIfEqual(2, 3) ||
    getRowIfEqual(0, 4) ||
    getRowIfEqual(2, 2)
  );
}

export function useWinningFields(
  outcome: Outcome | null,
  state: Int8Array
): number[] | null {
  const [fields, setFields] = React.useState<number[] | null>(null);

  React.useEffect(() => {
    if (!outcome) {
      setFields(null);
      return;
    }
    const winningFields = getWinningFields(state);
    if (winningFields) setFields(winningFields);
  }, [outcome, state]);

  return fields;
}
