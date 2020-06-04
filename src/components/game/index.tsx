import React from "react";

import {
  runGame,
  initialBoardState,
  BoardState,
  Outcome,
  Player,
} from "../../game";
import { Board } from "./board";

type GameProps = {
  id: number;
  player0: Player;
  player1: Player;
  onFinish?(id: number, winner: Player | null): void;
  swapPlayers?: boolean;
};

export enum GameState {
  Loading,
  Ready,
  Running,
  Finished,
}

const BoardStateCtx = React.createContext<BoardState>(initialBoardState);
export const useBoardState = () => React.useContext(BoardStateCtx);

const GameOutcomeCtx = React.createContext<Outcome | null>(null);
export const useGameOutcome = () => React.useContext(GameOutcomeCtx);

const GameStateCtx = React.createContext<GameState>(GameState.Loading);
export const useGameState = () => React.useContext(GameStateCtx);

export const Game: React.FC<GameProps> = ({
  id,
  player0,
  player1,
  onFinish,
  swapPlayers,
}) => {
  const [gameState, setGameState] = React.useState<GameState>(
    GameState.Loading
  );
  const [boardState, setBoardState] = React.useState<BoardState>(
    initialBoardState
  );
  const [outcome, setOutcome] = React.useState<Outcome | null>(null);

  React.useEffect(() => {
    if (gameState !== GameState.Ready) return;

    async function run() {
      setGameState(GameState.Running);
      setBoardState(initialBoardState);
      setOutcome(null);

      let p0 = player0;
      let p1 = player1;

      if (swapPlayers) {
        const tmp = p0;
        p0 = p1;
        p1 = tmp;
      }

      const newOutcome = await runGame(p0, p1, setBoardState);
      setOutcome(newOutcome);
      setGameState(GameState.Finished);

      if (onFinish)
        onFinish(id, newOutcome.winner && (newOutcome.winner.id ? p1 : p0));
    }

    run();
  }, [id, gameState, player0, player1, onFinish, swapPlayers]);

  React.useEffect(() => {
    setGameState(GameState.Ready);
  }, [id]);

  return (
    <GameStateCtx.Provider value={gameState}>
      <BoardStateCtx.Provider value={boardState}>
        <GameOutcomeCtx.Provider value={outcome}>
          <Board />
        </GameOutcomeCtx.Provider>
      </BoardStateCtx.Provider>
    </GameStateCtx.Provider>
  );
};
