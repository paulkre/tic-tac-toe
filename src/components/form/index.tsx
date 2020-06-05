import React from "react";

import styles from "./form.module.scss";

type FormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & { title?: string };

export const Form: React.FC<FormProps> = (props) => (
  <div className={styles.wrapper}>
    {props.title && (
      <div className={styles.title}>
        <div className={styles.titleInner}>{props.title}</div>
      </div>
    )}
    <form {...props} />
  </div>
);
