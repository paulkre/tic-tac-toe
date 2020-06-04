import React from "react";

import { useTrainingJob, TOTAL_BATCH_COUNT } from "./training-job";

export const Training: React.FC = () => {
  const [data, setData] = React.useState<number[][][] | null>(null);
  const job = useTrainingJob();

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

  function trainAndDownload() {
    if (!data) return;
    job.setData([...data]);
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
            <button onClick={trainAndDownload} disabled={job.running}>
              Train and download model
            </button>
          </p>
          {job.batchCount > 0 && (
            <p>
              Batches learned: {job.batchCount} / {TOTAL_BATCH_COUNT} (
              {Math.round((job.batchCount / TOTAL_BATCH_COUNT) * 100)}%)
            </p>
          )}
          {job.running && (
            <p>
              <button onClick={() => job.setData(null)}>Stop training</button>
            </p>
          )}
        </>
      )}
    </>
  );
};
