import React from "react";

import { Game } from ".";
import { useTrainingPlayer } from "../players/training-player";
import { randomPlayer } from "../players/random-player";
import { Player } from "../../game";

type Props = {
  id: number;
  onFinish?: (id: number) => void;
};

type ScoreBoard = { [name: string]: number };

export const TrainingGame: React.FC<Props> = ({ id, onFinish }) => {
  const [scoreBoard, setScoreBoard] = React.useState<ScoreBoard>({
    AI: 0,
    Random: 0,
  });
  const trainee = useTrainingPlayer(id);

  const handleFinish = React.useCallback(
    (id: number, winner: Player | null) => {
      const newScoreBoard: ScoreBoard = { ...scoreBoard };

      if (winner === trainee.player) newScoreBoard.AI++;
      if (winner === randomPlayer.player) newScoreBoard.Random++;

      setScoreBoard(newScoreBoard);

      if (onFinish) onFinish(id);
    },
    [onFinish, trainee.player, scoreBoard]
  );

  return (
    <>
      <Game
        id={id}
        player0={trainee}
        player1={randomPlayer}
        onFinish={handleFinish}
      />
      <div>
        <h3>Wins</h3>
        <table>
          <tbody>
            {Object.keys(scoreBoard).map((name, i) => (
              <tr key={i}>
                <td>{name}:</td>
                <td>{scoreBoard[name]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
