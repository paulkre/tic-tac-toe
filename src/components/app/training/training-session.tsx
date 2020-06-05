import React from "react";

// type Score = {
//   agent: number;
//   random: number;
// };

// const initialScore: Score = { agent: 0, random: 0 };

export type HyperParameters = {
  batchCount: number;
};

type TrainingSessionProps = {
  hyperParameters: HyperParameters;
};

export const TrainingSession: React.FC<TrainingSessionProps> = ({
  hyperParameters,
}) => {
  return <div>Training with {hyperParameters.batchCount} batches...</div>;
};
