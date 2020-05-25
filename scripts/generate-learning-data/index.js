const fs = require("fs");

const { getAllPossibleStates } = require("./get-all-possible-states");
const { getWinner } = require("./state");

const states = getAllPossibleStates();

const data = states.map((state) => {
  const output = state.map((value, action) => {
    if (value !== 0) return 0;

    const newState = [...state];

    newState[action] = 1;
    if (getWinner(newState)) return 5;

    newState[action] = -1;
    if (getWinner(newState)) return 2.5;

    return 0;
  });

  return [state, output];
});

fs.writeFileSync("./public/static/ml/data.json", JSON.stringify(data), "utf-8");

console.log(`${data.length} states saved.`);
