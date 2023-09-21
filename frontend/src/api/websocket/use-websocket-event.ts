import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "./websocket-context";
import { SocketEventsEnum } from "./websocket-events-enum";

export const useWebsocketEvent = <TResponse = any>(
  eventName: SocketEventsEnum
) => {
  const socket = useContext(WebsocketContext);
  const [data, setData] = useState<TResponse | undefined>();

  useEffect(() => {
    socket?.on(eventName, setData);
    return () => {
      socket?.off(eventName);
    };
  }, [socket, eventName]);

  return data;
};
