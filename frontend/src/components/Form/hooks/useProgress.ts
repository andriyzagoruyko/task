import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("localhost", { path: "/api/socket.io" });

export const useProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onProgress = (data: { progress: number }) =>
      setProgress(data.progress);

    socket.on("progress", onProgress);

    return () => {
      socket.off("progress", onProgress);
    };
  }, []);

  useEffect(() => {
    const clearProgress = () => {
      if (progress >= 100) setProgress(0);
    };
    setTimeout(clearProgress, 1000);
  }, [progress]);

  return { progress, userId: socket.id };
};
