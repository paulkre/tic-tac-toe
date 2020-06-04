import React from "react";

import { Game } from "../../game";
import {
  useHumanPlayer,
  PlayerControllerProvider,
} from "../../players/human-player";
import { GameRepeater } from "../../game/game-repeater";

export const Pvp: React.FC = () => {
  const p0 = useHumanPlayer();
  const p1 = useHumanPlayer();

  if (!p0.player || !p1.player) return null;

  return (
    <PlayerControllerProvider value={p0.controller || p1.controller}>
      <GameRepeater>
        <Game id={0} player0={p0.player} player1={p1.player} />
      </GameRepeater>
    </PlayerControllerProvider>
  );
};
