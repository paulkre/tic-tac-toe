import React from "react";

import { PlayerContainer } from "../game";
import { Player, FieldState } from "../../game";
import { createModel } from "../../game/ml/model";

const initialProbs: number[] = new Array(9).fill(0);

export function useAiPlayer(id?: number): PlayerContainer {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [probabilities, setProbabilities] = React.useState(initialProbs);

  React.useEffect(() => {
    createModel().then((model) => {
      setPlayer({
        async play(state) {
          const probs = await model.predict(state);

          setProbabilities(probs);

          const sortedActions = Array.from(probs.keys()).sort(
            (a, b) => probs[b] - probs[a]
          );

          while (sortedActions.length) {
            const action = sortedActions.shift()!;
            if (state[action] === FieldState.Empty) return action;
          }

          throw Error("Action prediction failed");
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
