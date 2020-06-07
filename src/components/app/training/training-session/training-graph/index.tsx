import React from "react";

import { TrainingState as TrainingGraphProps } from "..";

import styles from "./training-graph.module.scss";

type SegmentProps = { className: string; flex: number };
const Segment: React.FC<SegmentProps> = ({ className, flex }) => (
  <div className={className} style={{ flex }}></div>
);

export const TrainingGraph: React.FC<TrainingGraphProps> = ({
  gameCount,
  winCount,
  lossCount,
}) => (
  <div className={styles.wrapper}>
    <div className={styles.legend}>
      <div className={styles.greenText}>
        Wins
        <br />({winCount})
      </div>
      <div className={styles.grayText}>
        Draws
        <br />({gameCount - winCount - lossCount})
      </div>
      <div className={styles.redText}>
        Losses
        <br />({lossCount})
      </div>
    </div>
    <div className={styles.progressBar}>
      <Segment className={styles.green} flex={winCount}></Segment>
      <Segment
        className={styles.gray}
        flex={gameCount - winCount - lossCount}
      ></Segment>
      <Segment className={styles.red} flex={lossCount}></Segment>
    </div>
  </div>
);
