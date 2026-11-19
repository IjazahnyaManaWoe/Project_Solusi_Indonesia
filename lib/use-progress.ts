"use client";

import { useEffect, useState } from "react";
import {
  PROGRESS_EVENT,
  readProgress,
  type ProgressMap,
} from "@/lib/progress";

export function useProgress(): ProgressMap {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const refresh = () => setProgress(readProgress());

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(PROGRESS_EVENT, refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PROGRESS_EVENT, refresh);
    };
  }, []);

  return progress;
}
