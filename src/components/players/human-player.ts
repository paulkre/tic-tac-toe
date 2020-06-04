import React from "react";

import { Player } from "../../game";

type HumanPlayerContainer = {
  player: Player | null;
  controller: PlayerController | null;
};

export type PlayerController = {
  id: number;
  doAction(action: number): void;
  giveUp?(): void;
};

export const PlayerControllerCtx = React.createContext<PlayerController | null>(
  null
);
export const usePlayerController = () => React.useContext(PlayerControllerCtx);

export function useHumanPlayer(): HumanPlayerContainer {
  const [player, setPlayer] = React.useState<Player | null>(null);
  const [controller, setController] = React.useState<PlayerController | null>(
    null
  );

  React.useEffect(() => {
    setPlayer({
      play: (_state, id) =>
        new Promise<number>((resolve) => {
          setController({
            id,
            doAction(action) {
              setController(null);
              resolve(action);
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
