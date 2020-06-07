import React from "react";

import styles from "./form.module.scss";

export * from "./field-group";

type FormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

export const Form: React.FC<FormProps> = (props) => (
  <div className={styles.wrapper}>
    <form {...props} />
  </div>
);
