import React from "react";

import { Game } from "../../game";
import {
  useHumanPlayer,
  PlayerControllerProvider,
} from "../../players/human-player";
import { useAiPlayer, ProbsCtx } from "../../players/ai-player";
import { GameRepeater } from "../../game/game-repeater";

type PvaProps = {
  modelUrl?: string;
};

export const Pva: React.FC<PvaProps> = ({ modelUrl }) => {
  const human = useHumanPlayer();
  const ai = useAiPlayer(modelUrl);

  if (!human.player || !ai.player) return <p>Loading...</p>;

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
