import React from "react";

import { TrainingParameters } from "../../players/learning-player";
import { Section } from "./section";
import { ParameterForm } from "./parameter-form";
import { TrainingSession } from "./training-session";

import { TrainingResult } from "./training-result";

export const Training: React.FC = () => {
  const [
    trainingParameters,
    setTrainingParameters,
  ] = React.useState<TrainingParameters | null>(null);
  const [done, setDone] = React.useState(false);

  const handleSubmit = React.useCallback((params: TrainingParameters) => {
    setDone(false);
    setTrainingParameters({ ...params });
  }, []);

  const handleFinish = React.useCallback(() => {
    setDone(true);
  }, []);

  const handleCancel = React.useCallback(() => {
    setTrainingParameters(null);
  }, []);

  return (
    <>
      <Section title="Configuration">
        <ParameterForm
          onSubmit={handleSubmit}
          disableSubmit={!!trainingParameters && !done}
        />
      </Section>
      <Section title="Training">
        {trainingParameters ? (
          <TrainingSession
            trainingParameters={trainingParameters}
            onCancel={handleCancel}
            onFinish={handleFinish}
          />
        ) : (
          <p>Submit the form to start training.</p>
        )}
      </Section>
      <Section title="Result">
        {done ? (
          <TrainingResult />
        ) : (
          <p>Finish the training to test your agent.</p>
        )}
      </Section>
    </>
  );
};
