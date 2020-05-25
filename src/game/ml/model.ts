import * as tf from "@tensorflow/tfjs";

import { FieldState } from "..";
import { createNetwork, loadNetwork } from "./network";

export type Model = {
  predict(state: FieldState[]): Promise<number[]>;
  train(input: number[][], output: number[][]): Promise<any>;
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

  return {
    async predict(fields) {
      const result = tf.tidy(() => {
        const state = tf.tensor2d([fields]);
        const preds = network!.predict(state);
        const logits = Array.isArray(preds) ? preds[0] : preds;
        return tf.sigmoid(logits);
      });

      const probs = await result.data();
      result.dispose();

      return Array.from(probs);
    },

    async train(input, output) {
      const x = tf.tensor(input, [input.length, 9]);
      const y = tf.tensor(output, [output.length, 9]);

      await network!.fit(x, y);

      x.dispose();
      y.dispose();
    },

    download: () => network!.save("downloads://model"),
  };
}
