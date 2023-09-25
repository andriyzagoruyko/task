import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./api/apollo-client";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { __DEV__ } from "@apollo/client/utilities/globals";
import { WebsocketProvider } from "./api/websocket-context";
import { websocketClient } from "./api/websocket-client";

const rootElement = document.getElementById("root");
render(
  <React.StrictMode>
    <WebsocketProvider client={websocketClient}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </WebsocketProvider>
  </React.StrictMode>,
  rootElement
);

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
