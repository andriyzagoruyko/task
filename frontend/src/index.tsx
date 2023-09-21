import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./api/apollo/apollo-client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { __DEV__ } from "@apollo/client/utilities/globals";
import { WebsocketProvider } from "./api/websocket/websocket-context";
import { websocketClient } from "./api/websocket/websocket-client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <WebsocketProvider client={websocketClient}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </WebsocketProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
