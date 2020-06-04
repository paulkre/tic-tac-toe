import React from "react";

import { Game } from "../../game";
import {
  useHumanPlayer,
  PlayerControllerCtx,
} from "../../players/human-player";
import { useAiPlayer, ProbsCtx } from "../../players/ai-player";
import { GameRepeater } from "../../game/game-repeater";

export const Pva: React.FC = () => {
  const human = useHumanPlayer();
  const ai = useAiPlayer();

  if (!human.player || !ai.player) return null;

  return (
    <ProbsCtx.Provider value={ai.probabilities}>
      <PlayerControllerCtx.Provider value={human.controller}>
        <GameRepeater pauseDuration={2000} alternatePlayerOrder={true}>
          <Game id={0} player0={human.player} player1={ai.player} />
        </GameRepeater>
      </PlayerControllerCtx.Provider>
    </ProbsCtx.Provider>
  );
};
