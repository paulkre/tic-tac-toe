import React from "react";
import cn from "classnames";

import { Console } from "./console";
import { useGameState, useGameOutcome } from "..";
import styles from "./board.module.scss";
import { Field } from "./field";
import { useWinningFields } from "./winning-fields";

export const createBoardState = () => new Uint8Array(9);

export const Board: React.FC = () => {
  const { state } = useGameState();
  const outcome = useGameOutcome();
  const winningFields = useWinningFields(outcome, state);

  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.inner, outcome?.winner === null && styles.draw)}
      >
        {Array.from(state).map((n, i) => (
          <div
            className={cn(
              styles.item,
              winningFields?.includes(i) && styles.highlighted
            )}
            key={i}
          >
            <Field id={i} state={n} />
          </div>
        ))}
      </div>
      <Console />
    </div>
  );
};
