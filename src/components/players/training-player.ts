import React from "react";

import { Player } from "../../game";
import { createAgent } from "../../game/ml/agent";

type TrainingPlayerContainer = {
  player: Player | null;
  probabilities: Float32Array;
};

const initialProbs = new Float32Array(3 * 3);

export function useTrainingPlayer(id: number): TrainingPlayerContainer {
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

        async onFinish(isWinner) {
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
