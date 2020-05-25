/**
 * Determines the winner of a given state.
 *
 * @param {number[]} state
 * @returns {false | -1 | 1}
 */
function getWinner(state) {
  const rowIsEqual = (offset, stride) => {
    const first = state[offset];
    return (
      first !== 0 &&
      first === state[offset + stride] &&
      first === state[offset + 2 * stride] &&
      first
    );
  };

  return (
    rowIsEqual(0, 1) ||
    rowIsEqual(3, 1) ||
    rowIsEqual(6, 1) ||
    rowIsEqual(0, 3) ||
    rowIsEqual(1, 3) ||
    rowIsEqual(2, 3) ||
    rowIsEqual(0, 4) ||
    rowIsEqual(2, 2)
  );
}

/**
 * Determines whether or not a board state has empty fields left.
 *
 * @param {number[]} state
 * @returns {boolean}
 */
const hasEmptyFields = (state) => state.includes(0);

/**
 * Determines whether or not the game of the given state is over.
 *
 * @param {number[]} state
 * @returns {boolean}
 */
const gameIsOver = (state) => !hasEmptyFields(state) || !!getWinner(state);

module.exports = { getWinner, gameIsOver };
