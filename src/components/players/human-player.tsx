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
    let mounted = true;

    setPlayer({
      getAction: (_state, id) =>
        new Promise<number>((resolve, reject) => {
          let acted = false;

          const abort = () => reject(new GameAbortedException());

          if (!mounted) abort();

          setController({
            id,

            doAction(action) {
              setController(null);
              acted = true;
              resolve(action);
            },

            release() {
              if (!acted) abort();
            },
          });
        }),
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    player,
    controller,
  };
}
