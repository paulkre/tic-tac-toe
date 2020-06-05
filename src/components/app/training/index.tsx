import React from "react";

import { HyperParameterForm } from "./hyper-parameter-form";
import { TrainingSession, HyperParameters } from "./training-session";

export const Training: React.FC = () => {
  const [
    hyperParameters,
    setHyperParameters,
  ] = React.useState<HyperParameters | null>(null);

  return !hyperParameters ? (
    <HyperParameterForm onSubmit={setHyperParameters} />
  ) : (
    <TrainingSession hyperParameters={hyperParameters} />
  );
};
