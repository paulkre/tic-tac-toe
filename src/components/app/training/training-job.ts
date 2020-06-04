import React from "react";

import { createModel } from "../../../game/ml/model";
import { createNetwork } from "../../../game/ml/network";
import { shuffleArray } from "../../../util/shuffle-array";

export const TOTAL_BATCH_COUNT = 64;

type TrainingJob = {
  setData: React.Dispatch<React.SetStateAction<number[][][] | null>>;
  batchCount: number;
  running: boolean;
};

export function useTrainingJob(): TrainingJob {
  const [data, setData] = React.useState<number[][][] | null>(null);
  const [batchCount, setBatchCount] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    setBatchCount(0);
    setRunning(false);

    if (!data) return;

    let mounted = true;

    async function start() {
      setRunning(true);

      const model = await createModel(createNetwork());

      for (let i = 0; i < TOTAL_BATCH_COUNT; i++) {
        const batch = [...data!];
        shuffleArray(batch);

        const input = batch.map(([state]) => state);
        const output = batch.map(([, actions]) => actions);

        await model.train(input, output);

        if (!mounted) return;
        setBatchCount(i + 1);
      }

      setRunning(false);
      await model.download();
    }

    start();

    return () => {
      mounted = false;
    };
  }, [data]);

  return {
    setData,
    batchCount,
    running,
  };
}
