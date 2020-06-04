import React from "react";

import { Game } from "../../game";
import {
  useHumanPlayer,
  PlayerControllerProvider,
} from "../../players/human-player";
import { useAiPlayer, ProbsCtx } from "../../players/ai-player";
import { GameRepeater } from "../../game/game-repeater";

export const Pva: React.FC = () => {
  const human = useHumanPlayer();
  const ai = useAiPlayer();

  if (!human.player || !ai.player) return null;

  return (
    <ProbsCtx.Provider value={ai.probabilities}>
      <PlayerControllerProvider value={human.controller}>
        <GameRepeater pauseDuration={2000} alternatePlayerOrder={true}>
          <Game id={0} player0={human.player} player1={ai.player} />
        </GameRepeater>
      </PlayerControllerProvider>
    </ProbsCtx.Provider>
  );
};
