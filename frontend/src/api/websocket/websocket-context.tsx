import React, { createContext } from "react";
import { Socket } from "socket.io-client";

export const WebsocketContext = createContext<null | Socket>(null);

interface IWebsocketProvider {
  children: React.ReactNode;
  client: Socket;
}

export const WebsocketProvider = ({ children, client }: IWebsocketProvider) => (
  <WebsocketContext.Provider value={client}>
    {children}
  </WebsocketContext.Provider>
);
