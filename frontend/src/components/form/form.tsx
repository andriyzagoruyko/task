import { Box, Button, Paper, Tooltip, Typography } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import Stack from "@mui/material/Stack";
import { Rows } from "./rows";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { useRows } from "./hooks/useRowsForm";
import { useMutation } from "@apollo/client";
import { ENQUEUE_FILE, ALL_FILES } from "../../api/apollo/requests/file";
import { FileEntityInterface } from "../files/interfaces/file-entity.interface";

export function Form() {
  const styles = useStyles();
  const [enqueueFile, { loading, error, data, reset }] = useMutation(
    ENQUEUE_FILE,
    {
      update: (cache, { data: { newFile } }) => {
        const data = cache.readQuery<{ files: FileEntityInterface[] }>({
          query: ALL_FILES,
        });
        if (data) {
          const files = [newFile, ...data.files];
          cache.writeQuery({ query: ALL_FILES, data: { files } });
        }
      },
    }
  );
  const {
    rows,
    hasValidRows,
    addRow,
    deleteRow,
    updateRowLink,
    updateRowLang,
    handleFormSubmit,
  } = useRows((variables) => enqueueFile({ variables }));

  const handleAddRow = () => {
    reset();
    addRow();
  };

  return (
    <>
      <Box className={styles.formContainer}>
        <Typography variant="h4">Past your link</Typography>
        <Rows
          rows={rows}
          onLangChange={updateRowLang}
          onLinkChange={updateRowLink}
          onRowDelete={deleteRow}
        />
        <Stack direction="row" spacing={2} className={styles.buttonsContainer}>
          <Button variant="contained" onClick={handleAddRow}>
            Add more
          </Button>
          {hasValidRows ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
              disabled={loading}
            >
              Send
            </Button>
          ) : (
            <Tooltip title="All fields should be specified">
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!hasValidRows}
                >
                  Send
                </Button>
              </div>
            </Tooltip>
          )}
        </Stack>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={() => reset()}
        message={error?.message}
      />
      {!!data && (
        <Paper className={styles.successMessage}>
          <Alert severity="success">Successfully added file</Alert>
        </Paper>
      )}
    </>
  );
}
const useStyles = createUseStyles({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: 600,
    maxWidth: "100%",
    margin: "0 auto 0 auto",
    textAlign: "center",
  },

  select: {
    flexBasis: 120,
  },
  buttonsContainer: {
    marginTop: "12px",
    justifyContent: "center",
  },
  addMoreButton: {
    marginRight: "12px!important",
  },
  successMessage: {
    width: "280px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 30,
  },
});
