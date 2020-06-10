import React from "react";
import { Formik, FormikErrors } from "formik";

import { TrainingParameters } from "../../../players/learning-player";

import styles from "./form.module.scss";

const initialValues: TrainingParameters = { batchCount: 64, batchSize: 1000 };

type ParameterFormProps = {
  onSubmit(trainingParameters: TrainingParameters): void;
  disableSubmit?: boolean;
};

export const ParameterForm: React.FC<ParameterFormProps> = ({
  onSubmit,
  disableSubmit,
}) => (
  <div className={styles.wrapper}>
    <Formik<TrainingParameters>
      initialValues={initialValues}
      validate={({ batchCount }) => {
        const errors: FormikErrors<TrainingParameters> = {};
        if (!Number.isInteger(batchCount))
          errors.batchCount = "Number of batches must be an integer.";
        else if (batchCount <= 0)
          errors.batchCount = "Number of batches must be 1 or higher.";
        return errors;
      }}
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(false);
        onSubmit(data);
      }}
    >
      {({ values, handleSubmit, handleChange, handleBlur, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="batchCount">Number of batches:</label>
            <input
              type="number"
              id="batchCount"
              name="batchCount"
              value={values.batchCount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <label htmlFor="sampleCount">Number of samples in one batch:</label>
            <input
              type="number"
              id="sampleCount"
              name="sampleCount"
              value={values.batchSize}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <button type="submit" disabled={isSubmitting || disableSubmit}>
              Start training
            </button>
          </div>
        </form>
      )}
    </Formik>
  </div>
);
