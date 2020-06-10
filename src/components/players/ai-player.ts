import React from "react";

import { createWorker } from "../../game/ml-agent/worker";
import { AgentMode } from "../../game/ml-agent";

import { useAsyncWrap } from "../../util/async-wrap";
import { Player } from "../../game";

type AiPlayerContainer = {
  player: Player | null;
  probabilities: Float32Array;
};

export const ProbsCtx = React.createContext<Float32Array | null>(null);
export const useProbs = () => React.useContext(ProbsCtx);

const initialProbs = new Float32Array(3 * 3);

export function useAiPlayer(modelUrl?: string): AiPlayerContainer {
  const asyncWrap = useAsyncWrap();
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [probabilities, setProbabilities] = React.useState(initialProbs);

  React.useEffect(() => {
    async function initPlayer() {
      const agentWorker = await createWorker(
        AgentMode.UsePreTrainedModel,
        modelUrl
          ? {
              modelUrl,
            }
          : undefined
      );

      asyncWrap(setPlayer)({
        async getAction(state) {
          const { action, probs } = await agentWorker.predict(state);

          asyncWrap(setProbabilities)(probs);

          return action;
        },

        onOponentPlay(state) {
          agentWorker.predict(state).then(({ probs }) => {
            asyncWrap(setProbabilities)(probs);
          });
        },
      });
    }

    initPlayer();
  }, [asyncWrap, modelUrl]);

  React.useEffect(() => {
    setProbabilities(initialProbs);
  }, [modelUrl]);

  return {
    player,
    probabilities,
  };
}
