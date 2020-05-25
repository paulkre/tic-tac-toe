import React from "react";

import {
  createTrainingJob,
  TOTAL_BATCH_COUNT,
  TrainingJob,
  JobState,
} from "./job";

export const Training: React.FC = () => {
  const [data, setData] = React.useState<number[][][] | null>(null);
  const [batchCount, setBatchCount] = React.useState(0);
  const [job, setJob] = React.useState<TrainingJob | null>(null);

  React.useEffect(() => {
    if (data) return;

    let mounted = true;
    fetch(`${process.env.PUBLIC_URL}/static/ml/data.json`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setData(data);
      });

    return () => {
      mounted = false;
    };
  }, [data]);

  React.useEffect(() => {
    if (!job || job.getState() !== JobState.Idle) return;
    job.start().then(() => {
      if (job.getState() !== JobState.Stopped) {
        setJob(null);
        setBatchCount(0);
      }
    });
    return () => job.stop();
  }, [job]);

  function trainAndDownload() {
    if (!data) return;
    setJob(createTrainingJob(setBatchCount, data));
  }

  return (
    <>
      {!data ? (
        <p>Downloading training data...</p>
      ) : (
        <>
          <p>
            Training on labeled dataset:
            <br />
            <strong>{data.length}</strong> unique game states
          </p>
          <p>
            <button onClick={trainAndDownload} disabled={!!job}>
              Train and download model
            </button>
          </p>
          {batchCount > 0 && (
            <p>
              Batches learned: {batchCount} / {TOTAL_BATCH_COUNT} (
              {Math.round((batchCount / TOTAL_BATCH_COUNT) * 100)}%)
            </p>
          )}
          {!!job && job.getState() === JobState.Running && (
            <p>
              <button
                onClick={() => {
                  job.stop();
                  setJob(null);
                  setBatchCount(0);
                }}
              >
                Stop training
              </button>
            </p>
          )}
        </>
      )}
    </>
  );
};
