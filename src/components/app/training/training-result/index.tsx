import React from "react";

import { loadLayersModel } from "@tensorflow/tfjs";
import { Pva } from "../../pva";
import { tempModelUrl } from "../../../players/learning-player";

export const TrainingResult: React.FC = () => {
  const [downloading, setDownloading] = React.useState(false);

  const downloadModel = React.useCallback(() => {
    setDownloading(true);
    loadLayersModel(tempModelUrl)
      .then((model) => model.save("downloads://model"))
      .catch((err) => {
        console.log("Downloading model failed.");
        console.log(err);
      })
      .finally(() => {
        setDownloading(false);
      });
  }, []);

  return (
    <>
      <Pva modelUrl={tempModelUrl} />
      <div>
        <button onClick={downloadModel} disabled={downloading}>
          Download model
        </button>
      </div>
    </>
  );
};
