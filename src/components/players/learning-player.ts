import React from "react";

import { createModel, TrainingSample } from "../../game/ml/model";
import { createNetwork } from "../../game/ml/network";
import { Player, GameAbortedException, FieldState } from "../../game";

type LearningPlayer = {
  player: Player | null;
  learnedBatchCount: number;
};

type ActionRecord = {
  state: Int8Array;
  action: number;
};

export function useLearningPlayer(): LearningPlayer {
  const [learnedBatchCount, setLearnedBatchCount] = React.useState(0);
  const [player, setPlayer] = React.useState<Player | null>(null);

  React.useEffect(() => {
    let mounted = true;

    createModel(createNetwork()).then((model) => {
      const batch: TrainingSample[] = [];

      let actionRecord: ActionRecord | null = null;

      setPlayer({
        async getAction(state) {
          if (actionRecord) {
            // Remember previous action
            batch.push({
              ...actionRecord,
              nextState: Int8Array.from(state),
              reward: -0.01,
            });
          }

          const probs = await model.predict(state);
          if (!mounted) throw new GameAbortedException();

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
              batch.push({
                state: Int8Array.from(state),
                action,
                reward: -0.1,
              });
            }
          }

          return 0;
        },

        onFinish(isWinner) {
          if (!isWinner || !actionRecord) return;
          batch.push({
            ...actionRecord,
            reward: 10,
          });
        },
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    player,
    learnedBatchCount,
  };
}
