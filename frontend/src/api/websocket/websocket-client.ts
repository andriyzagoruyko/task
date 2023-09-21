import { io } from "socket.io-client";

export const websocketClient = io("http://localhost/", {
  path: "/websocket/socket.io",
  transports: ["websocket"],
});
