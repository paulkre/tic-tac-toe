import React from "react";

import { useAsyncWrap } from "../../../../util/async-wrap";
import { runGame } from "../../../../game";
import { useLearningPlayer } from "../../../players/learning-player";
import { randomPlayer } from "../../../players/random-player";

import styles from "./training-session.module.scss";

export type HyperParameters = {
  batchCount: number;
  sampleCount: number;
};

type TrainingSessionProps = {
  hyperParameters: HyperParameters;
  onExit?(): void;
};

type TrainingState = {
  gameCount: number;
  winCount: number;
  lossCount: number;
};

const initialTrainingState: TrainingState = {
  gameCount: 0,
  winCount: 0,
  lossCount: 0,
};

export const TrainingSession: React.FC<TrainingSessionProps> = ({
  hyperParameters: { sampleCount, batchCount },
  onExit,
}) => {
  const asyncWrap = useAsyncWrap();
  const {
    player: learningPlayer,
    model,
    recordedBatchesCount,
    recordedSamplesCount,
  } = useLearningPlayer(sampleCount);
  const [trainingState, setTrainingState] = React.useState(
    initialTrainingState
  );
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!learningPlayer || done) return;

    let player0 = learningPlayer;
    let player1 = randomPlayer;

    // Alternate player order after every game
    if (trainingState.gameCount % 2) {
      const tmp = player0;
      player0 = player1;
      player1 = tmp;
    }

    runGame({ player0, player1 }).then((winner) => {
      const newState: TrainingState = {
        ...trainingState,
        gameCount: trainingState.gameCount + 1,
      };

      if (winner) {
        if (winner === learningPlayer) newState.winCount++;
        else newState.lossCount++;
      }

      asyncWrap(setTrainingState)(newState);
    });
  }, [done, trainingState, learningPlayer, asyncWrap]);

  React.useEffect(() => {
    if (recordedBatchesCount >= batchCount && model) {
      model.download();
      setDone(true);
    }
  }, [recordedBatchesCount, batchCount, model]);

  return !done ? (
    <div className={styles.wrapper}>
      <table>
        <tbody>
          <tr>
            <th>Samples recorded:</th>
            <td>
              {recordedSamplesCount} / {sampleCount}
            </td>
          </tr>
          <tr>
            <th>Batches recorded:</th>
            <td>
              {recordedBatchesCount} / {batchCount}
            </td>
          </tr>
          <tr>
            <th>Games played:</th>
            <td>{trainingState.gameCount}</td>
          </tr>
          <tr>
            <th>Wins:</th>
            <td>{trainingState.winCount}</td>
          </tr>
          <tr>
            <th>Losses:</th>
            <td>{trainingState.lossCount}</td>
          </tr>
          <tr>
            <th>Draws:</th>
            <td>
              {trainingState.gameCount -
                trainingState.winCount -
                trainingState.lossCount}
            </td>
          </tr>
        </tbody>
      </table>
      {model && (
        <div>
          <button onClick={() => model.download()}>Download model</button>
        </div>
      )}
      {onExit && (
        <div>
          <button onClick={onExit}>Stop training</button>
        </div>
      )}
    </div>
  ) : (
    <div>Training finished.</div>
  );
};
