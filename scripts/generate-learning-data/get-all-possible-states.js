const product = require("cartesian-product");

const { gameIsOver } = require("./state");

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/**
 * Gets all possible states of a running game.
 * States which define a win, loss, or draw are excluded.
 *
 * @returns {number[][]}
 */
function getAllPossibleStates() {
  const states = product(new Array(9).fill([-1, 0, 1]));
  return states.filter((state) => {
    const val = sum(state);
    return val > -1 && val < 2 && !gameIsOver(state);
  });
}

module.exports = { getAllPossibleStates };
