import React from "react";

import styles from "./console.module.scss";
import { useGameOutcome, useGameId } from "../..";
import { usePlayerController } from "../../../players/human-player";
import { Outcome, FieldState } from "../../../../game";

import crossImgUrl from "../field/cross.svg";
import circleImgUrl from "../field/circle.svg";

const Symbol: React.FC<{ src: string }> = ({ src }) => (
  <img alt="Winning symbol" src={src} className={styles.symbol} />
);

function mapOutcomeWinnerToSymbol(state: number) {
  switch (state) {
    case FieldState.Cross:
      return <Symbol src={crossImgUrl} />;
    case FieldState.Circle:
      return <Symbol src={circleImgUrl} />;
  }
}

function mapOutcomeToMessage({ winner }: Outcome) {
  if (winner)
    return (
      <>
        {mapOutcomeWinnerToSymbol(winner.id)}
        {"\u00A0"}won!
      </>
    );

  return "It's a draw!";
}

export const Console: React.FC = () => {
  const [message, setMessage] = React.useState<JSX.Element | string | null>(
    null
  );
  const outcome = useGameOutcome();
  const gameId = useGameId();
  const controller = usePlayerController();

  const [agentTimeout, setAgentTimeout] = React.useState<NodeJS.Timeout | null>(
    null
  );

  React.useEffect(() => {
    setMessage(null);
  }, [gameId]);

  React.useEffect(() => {
    if (!outcome) return;
    setMessage(mapOutcomeToMessage(outcome));
  }, [outcome]);

  React.useEffect(() => {
    if (!controller) {
      if (agentTimeout) {
        clearTimeout(agentTimeout);
        setAgentTimeout(null);
      }
      setMessage(null);
      return;
    }

    if (agentTimeout) return;

    const timeout = setTimeout(() => {
      setMessage("Make your move!");
    }, 5000);
    setAgentTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [controller, agentTimeout]);

  return <div className={styles.wrapper}>{message}</div>;
};
