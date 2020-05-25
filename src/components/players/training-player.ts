import React from "react";

import { PlayerContainer } from "../game";
import { Player } from "../../game";
import { createAgent } from "../../game/ml/agent";

const initialProbs: number[] = new Array(9).fill(0);

export function useTrainingPlayer(id: number): PlayerContainer {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [probabilities, setProbabilities] = React.useState(initialProbs);

  React.useEffect(() => {
    createAgent().then((agent) => {
      setPlayer({
        async play(state) {
          const { action, probs } = await agent.predict(state);
          setProbabilities(probs);

          return action;
        },

        async onFinish(outcome, isWinner) {
          if (!outcome.winner) return;
          await agent.replay(isWinner);
        },
      });
    });
  }, []);

  React.useEffect(() => {
    setProbabilities(initialProbs);
  }, [id]);

  return {
    player,
    probabilities,
  };
}