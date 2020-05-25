import React from "react";

import {
  runGame,
  initialBoardState,
  BoardState,
  Outcome,
  Player,
} from "../../game";
import { Board } from "./board";

export type PlayerController = {
  id: number;
  doAction(action: number): void;
};

export interface PlayerContainer {
  player: Player | null;
  controller?: PlayerController | null;
  probabilities?: number[];
}

type GameProps = {
  id: number;
  player0: PlayerContainer;
  player1: PlayerContainer;
  onFinish?(id: number, winner: Player | null): void;
};

export enum GameState {
  Loading,
  Ready,
  Running,
  Finished,
}

const PlayerControllerCtx = React.createContext<PlayerController | null>(null);
export const usePlayerController = () => React.useContext(PlayerControllerCtx);

const ProbsCtx = React.createContext<number[] | null>(null);
export const useProbs = () => React.useContext(ProbsCtx);

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

      const swap = Math.random() < 0.5;
      const p0 = swap ? player1.player! : player0.player!;
      const p1 = swap ? player0.player! : player1.player!;

      const newOutcome = await runGame(p0, p1, setBoardState);
      setOutcome(newOutcome);
      setGameState(GameState.Finished);

      if (onFinish)
        onFinish(id, newOutcome.winner && (newOutcome.winner.id ? p1 : p0));
    }

    run();
  }, [id, gameState, player0.player, player1.player, onFinish]);

  React.useEffect(() => {
    if (!player0.player || !player1.player) return;
    setGameState(GameState.Ready);
  }, [id, player0.player, player1.player]);

  return (
    <GameStateCtx.Provider value={gameState}>
      <BoardStateCtx.Provider value={boardState}>
        <PlayerControllerCtx.Provider
          value={player0?.controller || player1?.controller || null}
        >
          <ProbsCtx.Provider
            value={player0?.probabilities || player1?.probabilities || null}
          >
            <GameOutcomeCtx.Provider value={outcome}>
              <Board />
            </GameOutcomeCtx.Provider>
          </ProbsCtx.Provider>
        </PlayerControllerCtx.Provider>
      </BoardStateCtx.Provider>
    </GameStateCtx.Provider>
  );
};
