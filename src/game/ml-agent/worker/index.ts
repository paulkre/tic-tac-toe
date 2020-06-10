import * as Comlink from "comlink";

import Worker from "worker-loader!./entrypoint"; // eslint-disable-line import/no-webpack-loader-syntax
import { AgentMode, AgentType, AgentProps } from "..";

let AgentWorker: Comlink.Remote<AgentType> | null = null;

export async function createWorker(mode: AgentMode, props?: AgentProps) {
  if (!AgentWorker) AgentWorker = Comlink.wrap<AgentType>(new Worker());

  const worker = await new AgentWorker();
  await worker.init(mode, props);
  return worker;
}
