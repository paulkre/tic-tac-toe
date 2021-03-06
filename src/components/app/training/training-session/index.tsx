import React from "react";

import { useAsyncWrap } from "../../../../util/async-wrap";
import { runGame } from "../../../../game";
import {
  useLearningPlayer,
  TrainingParameters,
} from "../../../players/learning-player";

import styles from "./training-session.module.scss";

type TrainingSessionProps = {
  trainingParameters: TrainingParameters;
  onCancel?(): void;
  onFinish?(): void;
};

export type TrainingState = {
  gameCount: number;
  winCount: number;
  lossCount: number;
};

export const TrainingSession: React.FC<TrainingSessionProps> = ({
  trainingParameters,
  onCancel,
  onFinish,
}) => {
  const asyncWrap = useAsyncWrap();
  const [gameCount, setGameCount] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const handleFinish = React.useCallback(() => {
    setGameCount(0);
    setDone(true);
    if (onFinish) onFinish();
  }, [onFinish]);

  const { player, batchCount, sampleCount } = useLearningPlayer(
    trainingParameters,
    handleFinish
  );

  React.useEffect(() => {
    if (trainingParameters) setDone(false);
  }, [trainingParameters]);

  React.useEffect(() => {
    if (!player || done) return;

    runGame({ player0: player, player1: player }).then(() => {
      asyncWrap(setGameCount)(gameCount + 1);
    });
  }, [done, gameCount, player, asyncWrap]);

  return !done ? (
    <div className={styles.wrapper}>
      <table>
        <tbody>
          <tr>
            <th>Games played:</th>
            <td>{gameCount}</td>
          </tr>
          <tr>
            <th>Samples recorded:</th>
            <td>
              {sampleCount} / {trainingParameters.batchSize}
            </td>
          </tr>
          <tr>
            <th>Batches learned:</th>
            <td>
              {batchCount} / {trainingParameters.batchCount}
            </td>
          </tr>
        </tbody>
      </table>
      {player && (
        <div>
          <button
            onClick={() => {
              player.finishTraining();
            }}
          >
            Finish training
          </button>
        </div>
      )}
      {onCancel && (
        <div>
          <button onClick={onCancel}>Cancel training</button>
        </div>
      )}
    </div>
  ) : (
    <p>Training finished.</p>
  );
};
