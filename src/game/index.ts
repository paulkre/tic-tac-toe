export enum FieldState {
  Empty = 0,
  Cross = 1,
  Circle = 2,
}

export type Player = {
  getAction(state: Int8Array, playerId: number): Promise<number>;
  onOponentPlay?(state: Int8Array): void;
  onFinish?(isWinner: boolean): void | Promise<void>;
};

export class GameAbortedException {}

export const initialState = new Int8Array(3 * 3);

const invertState = (state: Int8Array) =>
  state.map((n) => {
    switch (n) {
      case FieldState.Cross:
        return FieldState.Circle;
      case FieldState.Circle:
        return FieldState.Cross;
      default:
        return n;
    }
  });

type GameProps = {
  player0: Player;
  player1: Player;
  onStateUpdate?: (state: Int8Array, turn: number) => void;
};

type PlayerContainer = {
  player: Player;
  symbol: FieldState;
};

function isWin(state: Int8Array): boolean {
  const isWinningRow = (offset: number, stride: number) => {
    const first = state[offset];
    return (
      first !== 0 &&
      first === state[offset + stride] &&
      first === state[offset + 2 * stride]
    );
  };

  return (
    isWinningRow(0, 1) ||
    isWinningRow(3, 1) ||
    isWinningRow(6, 1) ||
    isWinningRow(0, 3) ||
    isWinningRow(1, 3) ||
    isWinningRow(2, 3) ||
    isWinningRow(0, 4) ||
    isWinningRow(2, 2)
  );
}

export async function runGame({
  player0,
  player1,
  onStateUpdate,
}: GameProps): Promise<Player | null> {
  const state = Int8Array.from(initialState);
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

    const action = await player.getAction(normalizedState, playerId);

    if (state[action] !== FieldState.Empty) throw Error("Illegal move");

    state[action] = symbol;
  }

  async function getWinner(): Promise<Player | null> {
    try {
      while (turn < 9) {
        await handleAgent();
        turn++;

        if (onStateUpdate) onStateUpdate(state, turn);

        if (isWin(state)) return players[(turn - 1) % 2].player;
      }
    } catch (e) {
      if (e instanceof GameAbortedException)
        return players[(turn + 1) % 2].player;
      else throw e;
    }

    return null;
  }

  const winner = await getWinner();

  for (const { player } of players) {
    if (player.onFinish) await player.onFinish(player === winner);
  }

  return winner;
}
