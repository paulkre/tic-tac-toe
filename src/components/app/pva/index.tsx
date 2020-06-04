import React from "react";

import { Game } from "../../game";
import { useHumanPlayer } from "../../players/human-player";
import { useAiPlayer } from "../../players/ai-player";
import { GameRepeater } from "../../game/game-repeater";

export const Pva: React.FC = () => {
  const human = useHumanPlayer();
  const ai = useAiPlayer();

  return (
    <GameRepeater pauseDuration={2000} alternatePlayerOrder={true}>
      <Game id={0} player0={human} player1={ai} />
    </GameRepeater>
  );
};
