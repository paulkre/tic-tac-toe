import React from "react";

import { Player, GameAbortedException } from "../../game";

type HumanPlayerContainer = {
  player: Player | null;
  controller: PlayerController | null;
};

export type PlayerController = {
  id: number;
  doAction(action: number): void;
  release(): void;
};

const PlayerControllerCtx = React.createContext<PlayerController | null>(null);
export const usePlayerController = () => React.useContext(PlayerControllerCtx);

export const PlayerControllerProvider: React.FC<{
  value: PlayerController | null;
}> = ({ children, value }) => {
  React.useEffect(
    () => () => {
      value?.release();
    },
    [value]
  );

  return (
    <PlayerControllerCtx.Provider value={value}>
      {children}
    </PlayerControllerCtx.Provider>
  );
};

export function useHumanPlayer(): HumanPlayerContainer {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [controller, setController] = React.useState<PlayerController | null>(
    null
  );

  React.useEffect(() => {
    setPlayer({
      play: (_state, id) =>
        new Promise<number>((resolve, reject) => {
          let acted = false;

          setController({
            id,

            doAction(action) {
              setController(null);
              acted = true;
              resolve(action);
            },

            release() {
              if (!acted) reject(new GameAbortedException());
            },
          });
        }),
    });
  }, []);

  return {
    player,
    controller,
  };
}
