import React from "react";
import cn from "classnames";

import { Console } from "./console";
import { useBoardState, useGameOutcome } from "..";
import styles from "./board.module.scss";
import { Field } from "./field";

export const createBoardState = () => new Uint8Array(9);

export const Board: React.FC = () => {
  const { fields } = useBoardState();
  const outcome = useGameOutcome();

  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.inner, outcome && !outcome.winner && styles.draw)}
      >
        {fields.map((n, i) => (
          <div
            className={cn(
              styles.item,
              outcome &&
                outcome.winner &&
                outcome.winner.fields.includes(i) &&
                styles.highlighted
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
