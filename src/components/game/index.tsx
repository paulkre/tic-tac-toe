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

const BoardStateCtx = React.createContext<BoardState>(initialBoardState);
export const useBoardState = () => React.useContext(BoardStateCtx);

const GameOutcomeCtx = React.createContext<Outcome | null>(null);
export const useGameOutcome = () => React.useContext(GameOutcomeCtx);

const GameIdCtx = React.createContext<number>(0);
export const useGameId = () => React.useContext(GameIdCtx);

export const Game: React.FC<GameProps> = ({
  id,
  player0,
  player1,
  onFinish,
  swapPlayers,
}) => {
  const [boardState, setBoardState] = React.useState<BoardState>(
    initialBoardState
  );
  const [outcome, setOutcome] = React.useState<Outcome | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function run() {
      setBoardState(initialBoardState);
      setOutcome(null);

      let p0 = player0;
      let p1 = player1;

      if (swapPlayers) {
        const tmp = p0;
        p0 = p1;
        p1 = tmp;
      }

      const newOutcome = await runGame(p0, p1, (state) => {
        if (mounted) setBoardState(state);
      });
      if (!mounted) return;

      setOutcome(newOutcome);

      if (onFinish)
        onFinish(id, newOutcome.winner && (newOutcome.winner.id ? p1 : p0));
    }

    run();

    return () => {
      mounted = false;
    };
  }, [id, player0, player1, onFinish, swapPlayers]);

  return (
    <GameIdCtx.Provider value={id}>
      <BoardStateCtx.Provider value={boardState}>
        <GameOutcomeCtx.Provider value={outcome}>
          <Board />
        </GameOutcomeCtx.Provider>
      </BoardStateCtx.Provider>
    </GameIdCtx.Provider>
  );
};
