import { Player } from "../../game";
import { FieldState } from "../../game";

export const randomPlayer: Player = {
  async play(fields) {
    const legalActions = Array.from(fields.keys()).filter(
      (action) => fields[action] === FieldState.Empty
    );
    return legalActions[Math.floor(Math.random() * legalActions.length)];
  },
};
