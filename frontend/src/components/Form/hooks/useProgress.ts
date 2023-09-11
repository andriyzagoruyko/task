import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("localhost", { path: "/api/socket.io" });

export const useProgress = () => {
  const [progress, setProgress] = useState(0);
  const [socketId, setSocketId] = useState<null | string>(null);

  useEffect(() => {
    const onConnect = () => setSocketId(socket.id);
    const onProgress = (data: { progress: number }) =>
      setProgress(data.progress);

    socket.on("connect", onConnect);
    socket.on("progress", onProgress);

    return () => {
      socket.off("connect", onConnect);
      socket.off("progress", onProgress);
    };
  }, []);

  useEffect(() => {
    const clearProgress = () => {
      if (progress >= 100) setProgress(0);
    };
    setTimeout(clearProgress, 500);
  }, [progress]);

  return { progress, socketId };
};
