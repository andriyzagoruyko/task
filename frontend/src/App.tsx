import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import { Form } from "./components/form/form";
import { createUseStyles } from "react-jss";
import { Files } from "./components/files/files";

const useStyles = createUseStyles({
  content: { marginTop: 128, marginBottom: 128 },
});

function App() {
  const styles = useStyles();
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h4">Recognizer</Typography>
        </Toolbar>
      </AppBar>
      <Container className={styles.content}>
        <Form />
        <Files />
      </Container>
    </>
  );
}

export default App;
