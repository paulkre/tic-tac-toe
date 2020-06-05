import { getWinningFields } from "./winning-fields";

export enum FieldState {
  Empty = 0,
  Cross = 1,
  Circle = -1,
}

export interface Outcome {
  winner: {
    player: Player;
    symbol: FieldState;
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

type PlayerContainer = {
  player: Player;
  symbol: FieldState;
};

export async function runGame({
  player0,
  player1,
  onStateUpdate,
}: GameProps): Promise<Outcome> {
  const state: FieldState[] = [...initialState];
  let turn: number = 0;
  const players: PlayerContainer[] = [
    {
      player: player0,
      symbol: FieldState.Cross,
    },
    {
      player: player1,
      symbol: FieldState.Circle,
    },
  ];

  async function handleAgent() {
    const playerId = turn % 2;

    const { player, symbol } = players[playerId];

    const normalizedState = playerId ? invertState(state) : state;

    const { onOponentPlay } = !playerId ? player1 : player0;
    if (onOponentPlay) onOponentPlay(normalizedState);

    const action = await player.play(normalizedState, playerId);

    if (state[action] !== FieldState.Empty) throw Error("Illegal move");

    state[action] = symbol;
  }

  async function getOutcome(): Promise<Outcome> {
    try {
      while (turn < 9) {
        await handleAgent();

        if (onStateUpdate) onStateUpdate([...state]);

        const winningFields = getWinningFields(state);
        if (winningFields) {
          const { player, symbol } = players[turn % 2];
          return {
            winner: {
              player,
              symbol,
              fields: winningFields,
            },
          };
        }

        turn++;
      }
    } catch {}

    return { winner: null };
  }

  const outcome = await getOutcome();

  players.forEach(({ player }, i) => {
    if (player.onFinish)
      player.onFinish(outcome, outcome.winner?.player === player);
  });

  return outcome;
}
