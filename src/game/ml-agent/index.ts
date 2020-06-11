import * as tf from "@tensorflow/tfjs";

import { FieldState, invertState, isWin } from "..";
import { learnMemory } from "./learn-memory";
import { createModel, loadModel } from "./model";

const epsilon = 0.1;
const discountRate = 0.95;
const maxQDepth = 2;
const defaultReward = -0.01;

export type TrainingSample = {
  state: Int8Array;
  action: number;
  reward: number;
};

type Prediction = {
  /** The id of the action that the network has decided on. */
  action: number;

  /** The network's probabilities for choosing a specific action. */
  probs: Float32Array;
};

export enum AgentMode {
  Default = 0,
  UsePreTrainedModel = 1 << 0,
  Training = 1 << 1,
}

export type AgentProps = {
  modelUrl?: string;
  batchSize?: number;
};

const initialProps: AgentProps = {
  modelUrl: `${process.env.PUBLIC_URL}/static/ml/model.json`,
  batchSize: 1000,
};

function getRandomLegalAction(state: Int8Array): number {
  const legalActions = Array.from(state.keys()).filter(
    (n) => state[n] === FieldState.Empty
  );
  return legalActions[Math.floor(Math.random() * legalActions.length)];
}

function isDraw(state: Int8Array): boolean {
  for (let i = 0; i < state.length; i++)
    if (state[i] === FieldState.Empty) return false;
  return true;
}

export class Agent {
  private mode: AgentMode = AgentMode.Default;
  private props: AgentProps = initialProps;
  private model: tf.LayersModel | null = null;

  private memory: TrainingSample[] = [];

  async init(mode: AgentMode, props?: AgentProps) {
    this.mode = mode;
    if (props)
      this.props = {
        ...this.props,
        ...props,
      };

    if (mode & AgentMode.UsePreTrainedModel) {
      this.model = await loadModel(this.props.modelUrl!);
    } else {
      this.model = createModel();
    }
  }

  async predict(state: Int8Array): Promise<number> {
    if (this.isTraining()) {
      const dist = await this.predictActionDistribution(state);
      const action =
        Math.random() <= epsilon
          ? getRandomLegalAction(state)
          : await this.decideAction(state, dist, (illegalAction) =>
              this.recordAction(state, illegalAction)
            );
      await this.recordAction(state, action);
      return action;
    }

    return await this.strictPredict(state);
  }

  async train() {
    await learnMemory(this.model!, this.memory);
    this.memory = [];
  }

  getProbabilities(state: Int8Array): Float32Array {
    const probs = this.predictActionDistribution(state);
    const sigmoids = tf.sigmoid(probs);
    const data = sigmoids.dataSync() as Float32Array;
    sigmoids.dispose();
    return data;
  }

  getSampleCount() {
    return this.memory.length;
  }

  save(url: string) {
    return this.model!.save(url);
  }

  private isTraining() {
    return !!(this.mode & AgentMode.Training);
  }

  private async strictPredict(state: Int8Array): Promise<number> {
    const dist = await this.predictActionDistribution(state);
    return await this.decideAction(state, dist);
  }

  /** Predicts the probability distribution of the action space. */
  private predictActionDistribution(state: Int8Array): Float32Array {
    return tf.tidy(() => {
      const stateVector = tf.tensor([Array.from(state)]);
      const preds = this.model!.predict(stateVector);
      const t = Array.isArray(preds) ? preds[0] : preds;
      return t.dataSync() as Float32Array;
    });
  }

  /** Decides on the most reasonable action based the current state of the game and a action probability distribution. */
  private async decideAction(
    state: Int8Array,
    distribution: Float32Array,
    onIllegalAction?: (action: number) => void | Promise<void>
  ): Promise<number> {
    const sortedActions = Array.from(distribution.keys()).sort(
      (a, b) => distribution[b] - distribution[a]
    );

    while (sortedActions.length) {
      const action = sortedActions.shift()!;
      if (state[action] === FieldState.Empty) return action;

      if (onIllegalAction) await onIllegalAction(action);
    }

    throw Error("Action prediction failed");
  }

  private async recordAction(state: Int8Array, action: number) {
    if (this.memory.length < this.props.batchSize!)
      this.memory.push(await this.createTrainingSample(state, action));
  }

  async createTrainingSample(
    state: Int8Array,
    action: number
  ): Promise<TrainingSample> {
    return {
      state,
      action,
      reward: await this.getReward(state, action),
    };
  }

  private async getReward(
    state: Int8Array,
    action: number,
    depth = 0
  ): Promise<number> {
    if (state[action] !== FieldState.Empty) return -0.1;

    const nextState = Int8Array.from(state);
    nextState[action] = FieldState.Cross;

    if (isWin(nextState)) return 5;

    if (isDraw(nextState)) return defaultReward;

    const invertedNextState = invertState(nextState);
    const oponentAction = await this.strictPredict(invertedNextState);
    nextState[oponentAction] = FieldState.Circle;

    if (isWin(nextState)) return -1;

    if (isDraw(nextState)) return defaultReward;

    if (depth < maxQDepth) {
      const nextAction = await this.strictPredict(nextState);
      return (
        defaultReward +
        Math.pow(discountRate, depth + 1) *
          (await this.getReward(nextState, nextAction, depth + 1))
      );
    }

    return defaultReward;
  }
}

export type AgentType = typeof Agent;
