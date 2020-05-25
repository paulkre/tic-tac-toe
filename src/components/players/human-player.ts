import React from "react";

import { Player } from "../../game";
import { PlayerContainer, PlayerController } from "../game";

export function useHumanPlayer(): PlayerContainer {
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
    controller,
    player,
  };
}
