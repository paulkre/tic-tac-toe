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

export type Player = {
  play(state: FieldState[], playerId: number): Promise<number>;
  onOponentPlay?(state: FieldState[]): void;
  onFinish?(outcome: Outcome, isWinner: boolean): void | Promise<void>;
};

export const initialState = Array<FieldState>(9).fill(FieldState.Empty);

const invertState = (state: FieldState[]) => state.map<FieldState>((n) => -n);

type GameProps = {
  player0: Player;
  player1: Player;
  onStateUpdate?: (state: FieldState[]) => void;
};

export async function runGame({
  player0,
  player1,
  onStateUpdate,
}: GameProps): Promise<Outcome> {
  const state: FieldState[] = [...initialState];
  let turn: number = 0;

  async function handleAgent() {
    const playerId = turn % 2;

    const symbol = !playerId ? FieldState.Cross : FieldState.Circle;
    const { play } = !playerId ? player0 : player1;

    const normalizedState = playerId ? invertState(state) : state;

    const { onOponentPlay } = !playerId ? player1 : player0;
    if (onOponentPlay) onOponentPlay(normalizedState);

    const action = await play(normalizedState, playerId);

    if (state[action] !== FieldState.Empty) throw Error("Illegal move");

    state[action] = symbol;
  }

  async function getOutcome(): Promise<Outcome> {
    try {
      while (turn < 9) {
        await handleAgent();

        turn++;
        if (onStateUpdate) onStateUpdate([...state]);

        const winningFields = getWinningFields(state);
        if (winningFields)
          return {
            winner: {
              id: state[winningFields[0]],
              fields: winningFields,
            },
          };
      }
    } catch {}

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
