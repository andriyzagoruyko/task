import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import "./App.css";
import { Form } from "./components/Form";
import { Assets } from "./components/Assets";

function App() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h4">Recognizer</Typography>
        </Toolbar>
      </AppBar>
      <Container className="content">
        <Form />
        <Assets />
      </Container>
    </>
  );
}

export default App;
