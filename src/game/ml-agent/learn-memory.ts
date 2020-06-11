import * as tf from "@tensorflow/tfjs";

import { TrainingSample } from ".";
import { shuffleArray } from "../../util/shuffle-array";

export async function learnMemory(
  model: tf.LayersModel,
  memory: TrainingSample[]
) {
  async function fit(inputs: Float32Array[], outputs: Float32Array[]) {
    const x = tf.tensor(inputs, [inputs.length, 9]);
    const y = tf.tensor(outputs, [outputs.length, 9]);

    await model!.fit(x, y);

    x.dispose();
    y.dispose();
  }

  const batch = shuffleArray(memory);

  const inputs: Float32Array[] = [];
  const outputs: Float32Array[] = [];

  for (const { state, action, reward } of batch) {
    const input = Float32Array.from(state);

    const predicts = tf.tidy(() => {
      const result = model.predict(tf.tensor([Array.from(input)]));
      const tensor = Array.isArray(result) ? result[0] : result;
      return tensor.dataSync();
    });

    predicts[action] = reward;
    inputs.push(input);
    outputs.push(predicts as Float32Array);
  }

  return fit(inputs, outputs);
}
