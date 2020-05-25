import { Dispatch, SetStateAction } from "react";

import { createModel } from "../../../game/ml/model";
import { createNetwork } from "../../../game/ml/network";
import { shuffleArray } from "../../../util/shuffle-array";

export const TOTAL_BATCH_COUNT = 512;

export enum JobState {
  Idle,
  Running,
  Stopped,
}

export type TrainingJob = {
  start(): Promise<void>;
  stop(): void;
  getState(): JobState;
  setState(state: JobState): void;
};

export function createTrainingJob(
  setBatchCount: Dispatch<SetStateAction<number>>,
  data: number[][][]
): TrainingJob {
  let state: JobState = JobState.Idle;

  function setState(newState: JobState) {
    state = newState;
  }

  async function start() {
    state = JobState.Running;
    setBatchCount(0);

    const model = await createModel(createNetwork());

    for (let i = 0; i < TOTAL_BATCH_COUNT; i++) {
      const batch = [...data!];
      shuffleArray(batch);

      const input = batch.map(([state]) => state);
      const output = batch.map(([, actions]) => actions);

      await model.train(input, output);

      if ((state as JobState) === JobState.Stopped) return;
      setBatchCount(i + 1);
    }

    await model.download();
  }

  return {
    start,

    stop() {
      setState(JobState.Stopped);
    },

    getState: () => state,

    setState,
  };
}
