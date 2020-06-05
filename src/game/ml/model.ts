import * as tf from "@tensorflow/tfjs";

import { createNetwork, loadNetwork } from "./network";

export type TrainingSample = {
  state: Int8Array;
  action: number;
  reward: number;
  nextState?: Int8Array;
};

export type Model = {
  predict(state: Int8Array): Promise<Float32Array>;
  train(batch: TrainingSample[]): Promise<any>;
  download(): Promise<tf.io.SaveResult>;
};

export async function createModel(network?: tf.LayersModel): Promise<Model> {
  if (!network) {
    try {
      network = await loadNetwork();
    } catch (err) {
      network = createNetwork();
    }
  }

  async function fit(input: number[][], output: number[][]) {
    const x = tf.tensor(input, [input.length, 9]);
    const y = tf.tensor(output, [output.length, 9]);

    await network!.fit(x, y);

    x.dispose();
    y.dispose();
  }

  async function predict(fieldStates: Int8Array): Promise<Float32Array> {
    const result = tf.tidy(() => {
      const state = tf.tensor2d([Array.from(fieldStates)]);
      const preds = network!.predict(state);
      const logits = Array.isArray(preds) ? preds[0] : preds;
      return tf.sigmoid(logits);
    });

    const probs = await result.data();
    result.dispose();

    return Float32Array.from(probs);
  }

  return {
    predict,

    async train(batch) {
      for (const { state } of batch) {
        const preds = await predict(state);
      }
    },

    download: () => network!.save("downloads://model"),
  };
}
