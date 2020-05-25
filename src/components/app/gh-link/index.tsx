import React from "react";

import styles from "./gh-link.module.scss";
import iconUrl from "./github.svg";

export const GithubLink: React.FC = () => (
  <a
    href="https://github.com/paulkre/tic-tac-toe"
    target="_blank"
    rel="noopener noreferrer"
    className={styles.link}
  >
    <img src={iconUrl} alt="GitHub icon" />
  </a>
);
