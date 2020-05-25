import * as tf from "@tensorflow/tfjs";

const modelUrl = `${process.env.PUBLIC_URL}/static/ml/model.json`;

export const loadNetwork = () => tf.loadLayersModel(modelUrl);

export function createNetwork() {
  const network = tf.sequential({
    layers: [
      tf.layers.dense({
        inputShape: [9],
        units: 32,
        activation: "relu",
      }),
      tf.layers.dense({
        units: 9,
      }),
    ],
  });

  network.summary();
  network.compile({ optimizer: tf.train.adam(), loss: "meanSquaredError" });

  return network;
}
