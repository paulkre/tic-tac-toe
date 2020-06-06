import React from "react";

import { useAsyncWrap } from "../../util/async-wrap";
import { createModel, Model, TrainingSample } from "../../game/ml/model";
import { createNetwork } from "../../game/ml/network";
import { Player, FieldState } from "../../game";

type LearningPlayer = {
  player: Player | null;
  model: Model | null;
  recordedBatchesCount: number;
  recordedSamplesCount: number;
};

type ActionRecord = {
  state: Int8Array;
  action: number;
};

export function useLearningPlayer(sampleCount: number): LearningPlayer {
  const asyncWrap = useAsyncWrap();
  const [model, setModel] = React.useState<Model | null>(null);
  const [recordedSamplesCount, setRecordedSamplesCount] = React.useState(0);
  const [recordedBatchesCount, setRecordedBatchesCount] = React.useState(0);
  const [player, setPlayer] = React.useState<Player | null>(null);

  React.useEffect(() => {
    createModel(createNetwork()).then((model) => {
      asyncWrap(setModel)(model);
    });
  }, [asyncWrap]);

  React.useEffect(() => {
    if (!model) return;

    let batch: TrainingSample[] = [];
    let localBatchCount = 0;

    let actionRecord: ActionRecord | null = null;

    async function learnBatch() {
      await model!.train(batch);
      batch = [];
      localBatchCount++;

      asyncWrap(setRecordedSamplesCount)(0);
      asyncWrap(setRecordedBatchesCount)(localBatchCount);
    }

    async function recordSample(sample: TrainingSample) {
      if (batch.length < sampleCount) {
        batch.push(sample);
        asyncWrap(setRecordedSamplesCount)(batch.length);
      } else {
        await learnBatch();
      }
    }

    asyncWrap(setPlayer)({
      async getAction(state) {
        if (actionRecord) {
          // Remember previous action
          await recordSample({
            ...actionRecord,
            nextState: Int8Array.from(state),
            reward: -0.01,
          });
        }

        const probs = await model.predict(state);

        const sortedActions = Array.from(probs.keys()).sort(
          (a, b) => probs[b] - probs[a]
        );

        while (sortedActions.length) {
          const action = sortedActions.shift()!;

          if (state[action] === FieldState.Empty) {
            actionRecord = {
              state: Int8Array.from(state),
              action,
            };

            return action;
          } else {
            // Punish illegal action
            await recordSample({
              state: Int8Array.from(state),
              action,
              reward: -0.1,
            });
          }
        }

        return 0;
      },

      async onFinish(isWinner) {
        if (isWinner)
          await recordSample({
            ...actionRecord!,
            reward: 10,
          });
        else
          await recordSample({
            ...actionRecord!,
            reward: -0.01,
          });
      },
    });
  }, [model, sampleCount, asyncWrap]);

  return {
    player,
    model,
    recordedBatchesCount,
    recordedSamplesCount,
  };
}
