import { useFF } from "@/lib/state";
import React from "react";
import Exporter from "./Exporter";

const ExportControls = () => {
  const progress = useFF((st) => st.progress);
  return (
    <div className="w-full absolute py-1 bottom-0 bg-neutral-200 z-40">
      <Exporter />
      {Number.isNaN(progress) || progress < 1 ? (
        <progress className="progress progress-primary w-56 mx-4 inline-block" />
      ) : (
        <progress
          className="progress progress-primary w-56 mx-4 inline-block"
          value={1}
          max={1}
        />
      )}
    </div>
  );
};

export default ExportControls;
