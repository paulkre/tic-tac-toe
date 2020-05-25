import React from "react";

import { Game } from ".";
import { useAiPlayer } from "../players/ai-player";

type Props = {
  id: number;
  onFinish?: (id: number) => void;
};

export const AvaGame: React.FC<Props> = ({ id, onFinish }) => {
  const ai0 = useAiPlayer(id);
  const ai1 = useAiPlayer(id);

  return <Game id={id} player0={ai0} player1={ai1} onFinish={onFinish} />;
};
