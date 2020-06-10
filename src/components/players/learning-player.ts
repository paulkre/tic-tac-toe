import React from "react";

import { useAsyncWrap } from "../../util/async-wrap";
import { AgentMode } from "../../game/ml-agent";
import { createWorker } from "../../game/ml-agent/worker";
import { Player } from "../../game";

export const tempModelUrl = "indexeddb://model";

export type TrainingParameters = {
  batchCount: number;
  batchSize: number;
};

type LearningPlayer = {
  player: Player | null;
  batchCount: number;
  sampleCount: number;
};

export function useLearningPlayer(
  trainingParameters: TrainingParameters
): LearningPlayer {
  const asyncWrap = useAsyncWrap();
  const [sampleCount, setSampleCount] = React.useState(0);
  const [batchCount, setBatchCount] = React.useState(0);
  const [player, setPlayer] = React.useState<Player | null>(null);

  React.useEffect(() => {
    async function initPlayer() {
      const agentWorker = await createWorker(AgentMode.Training, {
        batchSize: trainingParameters.batchSize,
      });

      let localBatchCount = 0;

      asyncWrap(setPlayer)({
        async getAction(state) {
          return (await agentWorker.predict(state)).action;
        },

        async onFinish() {
          const sampleCount = await agentWorker.getSampleCount();
          asyncWrap(setSampleCount)(sampleCount);

          if (sampleCount >= trainingParameters.batchSize) {
            await agentWorker.train();
            localBatchCount++;
            asyncWrap(setBatchCount)(localBatchCount);
            asyncWrap(setSampleCount)(0);

            if (localBatchCount >= trainingParameters.batchCount) {
              await agentWorker.save(tempModelUrl);
            }
          }
        },
      });
    }

    initPlayer();
  }, [trainingParameters, asyncWrap]);

  return {
    player,
    batchCount,
    sampleCount,
  };
}
