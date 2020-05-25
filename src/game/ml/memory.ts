type Sample = {
  state: number[];
  action: number;
  reward: number;
  nextState: number[];
};

type Memory = {
  push(sample: Sample): void;
};

export function createMemory(): Memory {
  const samples: Sample[] = [];

  return {
    push(sample) {
      samples.push(sample);
    },
  };
}
