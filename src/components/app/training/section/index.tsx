import React from "react";

import styles from "./section.module.scss";

export const Section: React.FC<{ title: string }> = ({ children, title }) => (
  <div className={styles.wrapper}>
    {title && (
      <div className={styles.title}>
        <div className={styles.titleInner}>{title}</div>
      </div>
    )}
    {children}
  </div>
);
