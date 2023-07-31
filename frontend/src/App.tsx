import React from "react";
import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import { Form } from "./components/Form/Form";
import { Assets } from "./components/Assets";
import { createUseStyles } from "react-jss";
import { AppContextProvider } from "./context";

const useStyles = createUseStyles({
  content: { marginTop: 128, marginBottom: 128 },
});

function App() {
  const styles = useStyles();
  return (
    <AppContextProvider>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h4">Recognizer</Typography>
        </Toolbar>
      </AppBar>
      <Container className={styles.content}>
        <Form />
        <Assets />
      </Container>
    </AppContextProvider>
  );
}

export default App;
