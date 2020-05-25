import React from "react";

import { Game } from "../../game";
import { useHumanPlayer } from "../../players/human-player";
import { GameRepeater } from "../../game/game-repeater";

export const Pvp: React.FC = () => {
  const p0 = useHumanPlayer();
  const p1 = useHumanPlayer();

  return (
    <GameRepeater>
      <Game id={0} player0={p0} player1={p1} />
    </GameRepeater>
  );
};
