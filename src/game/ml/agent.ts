import * as tf from "@tensorflow/tfjs";

import { FieldState } from "..";
import { loadNetwork, createNetwork } from "./network";
import { shuffleArray } from "../../util/shuffle-array";

type Prediction = {
  action: number;
  probs: number[];
};

type Agent = {
  predict(state: FieldState[]): Promise<Prediction>;
  replay(isWin: boolean): void;
};

type Sample = {
  state: tf.Tensor;
  preds: tf.Tensor;
  action: number;
  nextSample?: Sample;
};

const DISCOUNT_RATE = 0.95;

function chooseAction(probs: number[], fields: FieldState[]) {
  const sortedActions = Array.from(probs.keys()).sort(
    (a, b) => probs[b] - probs[a]
  );

  while (sortedActions.length) {
    const action = sortedActions.shift()!;
    if (fields[action] === FieldState.Empty) return action;
  }

  throw new Error("Action selection failed");
}

export async function createAgent(network?: tf.LayersModel): Promise<Agent> {
  try {
    network = await loadNetwork();
  } catch (err) {
    network = createNetwork();
  }

  let batch: Sample[] = [];

  return {
    async predict(fields) {
      const state = tf.tensor2d([fields]);
      const preds = tf.tidy(() => {
        const result = network!.predict(state);
        return Array.isArray(result) ? result[0] : result;
      });

      const probs = tf.tidy(() => Array.from(preds.sigmoid().dataSync()));
      const action = chooseAction(probs, fields);

      const sample: Sample = { state, preds, action };

      if (batch.length) batch[batch.length - 1].nextSample = sample;
      batch.push(sample);

      return { action, probs };
    },

    async replay(isWinner) {
      const reward = isWinner ? 5 : 0;
      shuffleArray(batch);

      const inputs: tf.backend_util.TypedArray[] = [];
      const outputs: tf.backend_util.TypedArray[] = [];

      batch.forEach(({ state, preds, action, nextSample }) => {
        const stateData = state.dataSync();
        const data = preds.dataSync();
        data[action] = nextSample
          ? reward +
            DISCOUNT_RATE * tf.tidy(() => nextSample.state.max().dataSync()[0])
          : reward;
        for (let i = 0; i < data.length; i++)
          if (stateData[i] === 0) data[i] = -5;

        inputs.push(stateData);
        outputs.push(data);
      });

      const x = tf.tensor(inputs, [inputs.length, 9]);
      const y = tf.tensor(outputs, [outputs.length, 9]);

      await network?.fit(x, y);

      x.dispose();
      y.dispose();

      batch.forEach(({ state, preds }, i) => {
        state.dispose();
        preds.dispose();
      });

      batch = [];
    },
  };
}
