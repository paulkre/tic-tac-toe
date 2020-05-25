import React from "react";
import cn from "classnames";

import { FieldState } from "../../../../game";
import { usePlayerController, useBoardState, useProbs } from "../..";
import styles from "./field.module.scss";

type FieldProps = { id: number; state: FieldState };

function mapStateToStyle(state: FieldState): string | null {
  switch (state) {
    case FieldState.Cross:
      return styles.cross;
    case FieldState.Circle:
      return styles.circle;
    default:
      return null;
  }
}

const mapTurnToStyle = (turn: number) =>
  turn % 2 ? styles.circle : styles.cross;

export const Field: React.FC<FieldProps> = ({ id, state }) => {
  const humanController = usePlayerController();
  const boardState = useBoardState();
  const probs = useProbs();

  const inner = (
    <div className={styles.wrapper}>
      <div
        className={cn(
          styles.symbol,
          state !== FieldState.Empty && styles.visible,
          mapStateToStyle(state) || mapTurnToStyle(boardState.turn)
        )}
      ></div>
      {probs && <div className={styles.prob}>{probs[id].toFixed(2)}</div>}
    </div>
  );

  return humanController && state === 0 ? (
    <button
      className={styles.button}
      onClick={() => {
        humanController?.doAction(id);
      }}
    >
      {inner}
    </button>
  ) : (
    inner
  );
};
