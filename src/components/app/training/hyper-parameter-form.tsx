import React from "react";
import { Formik, FormikErrors } from "formik";

import { Form } from "../../form";
import { HyperParameters } from "./training-session";

const initialValues: HyperParameters = { batchCount: 16 };

type HyperParameterProps = {
  onSubmit(hyperParameters: HyperParameters): void;
};

export const HyperParameterForm: React.FC<HyperParameterProps> = ({
  onSubmit,
}) => (
  <Formik<HyperParameters>
    initialValues={initialValues}
    validate={({ batchCount }) => {
      const errors: FormikErrors<HyperParameters> = {};
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
    {({
      values,
      errors,
      handleSubmit,
      handleChange,
      handleBlur,
      isSubmitting,
    }) => (
      <Form onSubmit={handleSubmit} title="Hyper Parameters">
        <div>
          <label htmlFor="batchCount">Number of batches:</label>
          <input
            type="number"
            id="batchCount"
            name="batchCount"
            value={values.batchCount}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: "4rem" }}
          />
        </div>
        {errors.batchCount && <div>{errors.batchCount}</div>}
        <div>
          <button type="submit" disabled={isSubmitting}>
            Start training
          </button>
        </div>
      </Form>
    )}
  </Formik>
);
