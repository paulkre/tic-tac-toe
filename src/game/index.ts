import { getWinningFields } from "./winning-fields";

export enum FieldState {
  Empty = 0,
  Cross = 1,
  Circle = -1,
}

export interface Outcome {
  winner: {
    id: number;
    fields: number[];
  } | null;
}

export type Game = {
  state: number[];
  outcome: Outcome | null;
};

export type BoardState = {
  fields: FieldState[];
  turn: number;
};

export type Player = {
  play: (state: FieldState[], playerId: number) => Promise<number>;
  onFinish?: (outcome: Outcome, isWinner: boolean) => void | Promise<void>;
};

export const initialBoardState: BoardState = {
  fields: new Array(9).fill(FieldState.Empty),
  turn: 0,
};

export async function runGame(
  player0: Player,
  player1: Player,
  onStateUpdate?: (state: BoardState) => void
): Promise<Outcome> {
  let boardState: BoardState = initialBoardState;

  async function handleAgent() {
    const playerId = boardState.turn % 2;

    const isFirstPlayer = playerId === 0;
    const symbol = isFirstPlayer ? FieldState.Cross : FieldState.Circle;
    const { play } = isFirstPlayer ? player0 : player1;

    const action = await play(
      playerId ? boardState.fields.map((n) => -n) : boardState.fields,
      playerId
    );

    if (boardState.fields[action] !== FieldState.Empty)
      throw Error("Illegal move");

    boardState = {
      fields: [...boardState.fields],
      turn: boardState.turn + 1,
    };
    boardState.fields[action] = symbol;

    if (onStateUpdate) onStateUpdate(boardState);
  }

  async function getOutcome(): Promise<Outcome> {
    while (boardState.turn < 9) {
      await handleAgent();

      const winningFields = getWinningFields(boardState.fields);
      if (winningFields)
        return {
          winner: {
            id: boardState.fields[winningFields[0]],
            fields: winningFields,
          },
        };
    }

    return { winner: null };
  }

  const outcome = await getOutcome();

  if (player0.onFinish)
    await player0.onFinish(
      outcome,
      outcome.winner ? outcome.winner.id === 0 : false
    );
  if (player1.onFinish)
    await player1.onFinish(
      outcome,
      outcome.winner ? outcome.winner.id === 1 : false
    );

  return outcome;
}
