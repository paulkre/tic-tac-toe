import * as tf from "@tensorflow/tfjs";

export function loadModel(modelUrl: string) {
  return tf.loadLayersModel(modelUrl);
}

export function createModel() {
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
