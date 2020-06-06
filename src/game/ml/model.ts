import * as tf from "@tensorflow/tfjs";

import { shuffleArray } from "../../util/shuffle-array";
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
      console.log(err);

      network = createNetwork();
    }
  }

  async function fit(inputs: Float32Array[], outputs: Float32Array[]) {
    const x = tf.tensor(inputs, [inputs.length, 9]);
    const y = tf.tensor(outputs, [outputs.length, 9]);

    await network!.fit(x, y);

    x.dispose();
    y.dispose();
  }

  return {
    async predict(fieldStates: Int8Array): Promise<Float32Array> {
      const result = tf.tidy(() => {
        const state = tf.tensor([Array.from(fieldStates)]);
        const preds = network!.predict(state);
        const logits = Array.isArray(preds) ? preds[0] : preds;
        return tf.sigmoid(logits);
      });

      const probs = await result.data();
      result.dispose();

      return Float32Array.from(probs);
    },

    async train(batch) {
      shuffleArray(batch);

      const inputs: Float32Array[] = [];
      const outputs: Float32Array[] = [];

      for (const { state, action, reward } of batch) {
        const input = Float32Array.from(state);

        const predicts = tf.tidy(() => {
          const result = network!.predict(tf.tensor([Array.from(input)]));
          const tensor = Array.isArray(result) ? result[0] : result;
          return tensor.dataSync();
        });

        predicts[action] = reward;
        inputs.push(input);
        outputs.push(predicts as Float32Array);
      }

      await fit(inputs, outputs);
    },

    download: () => network!.save("downloads://model"),
  };
}
