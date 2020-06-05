import React from "react";

import { Player, FieldState, GameAbortedException } from "../../game";
import { createModel } from "../../game/ml/model";

type AiPlayerContainer = {
  player: Player | null;
  probabilities: Float32Array;
};

export const ProbsCtx = React.createContext<Float32Array | null>(null);
export const useProbs = () => React.useContext(ProbsCtx);

const initialProbs = new Float32Array(3 * 3);

export function useAiPlayer(id?: number): AiPlayerContainer {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [probabilities, setProbabilities] = React.useState(initialProbs);

  React.useEffect(() => {
    let mounted = true;

    createModel().then((model) => {
      setPlayer({
        async getAction(state) {
          const probs = await model.predict(state);
          if (!mounted) throw new GameAbortedException();

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

        onOponentPlay(state) {
          model.predict(state).then((probs) => {
            setProbabilities(probs);
          });
        },
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    setProbabilities(initialProbs);
  }, [id]);

  return {
    player,
    probabilities,
  };
}
