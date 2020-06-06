import * as tf from "@tensorflow/tfjs";

const modelUrl = `${process.env.PUBLIC_URL}/static/ml/model.json`;

export const loadNetwork = () => tf.loadLayersModel(modelUrl);

export function createNetwork() {
  const network = tf.sequential({
    layers: [
      tf.layers.embedding({
        inputShape: [9],
        inputDim: 3,
        outputDim: 8,
      }),
      tf.layers.flatten(),
      tf.layers.dense({
        units: 64,
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
