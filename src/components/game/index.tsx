import React from "react";

import { runGame, initialState, FieldState, Player } from "../../game";
import { Board } from "./board";

type GameProps = {
  id: number;
  player0: Player;
  player1: Player;
  onFinish?(id: number, winner: Player | null): void;
  swapPlayers?: boolean;
};

export type GameState = {
  state: typeof initialState;
  turn: number;
};

export type Outcome = {
  winner: FieldState | null;
};

const initialGameState: GameState = {
  state: initialState,
  turn: 0,
};

const GameStateCtx = React.createContext<GameState>(initialGameState);
export const useGameState = () => React.useContext(GameStateCtx);

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
  const [gameState, setGameState] = React.useState<GameState>(initialGameState);
  const [outcome, setOutcome] = React.useState<Outcome | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function run() {
      setGameState(initialGameState);
      setOutcome(null);

      let p0 = player0;
      let p1 = player1;

      if (swapPlayers) {
        const tmp = p0;
        p0 = p1;
        p1 = tmp;
      }

      const winner = await runGame({
        player0: p0,
        player1: p1,
        onStateUpdate: (state, turn) => {
          if (!mounted) return;
          setGameState({ state: Int8Array.from(state), turn });
        },
      });

      if (!mounted) return;

      if (winner)
        setOutcome({
          winner: winner === p0 ? FieldState.Cross : FieldState.Circle,
        });
      else setOutcome({ winner: null });

      if (onFinish) onFinish(id, winner);
    }

    run();

    return () => {
      mounted = false;
    };
  }, [id, player0, player1, onFinish, swapPlayers]);

  return (
    <GameIdCtx.Provider value={id}>
      <GameStateCtx.Provider value={gameState}>
        <GameOutcomeCtx.Provider value={outcome}>
          <Board />
        </GameOutcomeCtx.Provider>
      </GameStateCtx.Provider>
    </GameIdCtx.Provider>
  );
};
