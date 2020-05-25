export function getWinningFields(board: number[]) {
  const getRowIfEqual = (offset: number, stride: number) => {
    const a = offset;
    const b = offset + stride;
    const c = offset + 2 * stride;
    return (
      board[a] !== 0 &&
      board[a] === board[b] &&
      board[a] === board[c] && [a, b, c]
    );
  };

  return (
    getRowIfEqual(0, 1) ||
    getRowIfEqual(3, 1) ||
    getRowIfEqual(6, 1) ||
    getRowIfEqual(0, 3) ||
    getRowIfEqual(1, 3) ||
    getRowIfEqual(2, 3) ||
    getRowIfEqual(0, 4) ||
    getRowIfEqual(2, 2)
  );
}
