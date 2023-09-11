import { Box, Button, Paper, Tooltip, Typography } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import Stack from "@mui/material/Stack";
import { Rows } from "./Rows";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { useRows } from "./hooks/useRows";
import { ProgressBar } from "../ProgressBar";
import { useProgress } from "./hooks/useProgress";

export function Form() {
  const styles = useStyles();
  const {
    rows,
    updateRow,
    hasAddedAssets,
    addRow,
    deleteRow,
    errorMessage,
    cleanErrorMessage,
    loading,
    createAssetsFromRows,
  } = useRows();

  const { progress, socketId } = useProgress();
  const hasValidRows = rows.every((row) => row.isLinkValid && row.isLangValid);

  const handleLinkChange = (index: number, fileLink: string) =>
    updateRow(index, { ...rows[index], url: fileLink });

  const handleLangChange = (index: number, lang: string) =>
    updateRow(index, { ...rows[index], lang });

  const handleSubmitClick = () => createAssetsFromRows(socketId);

  return (
    <>
      <ProgressBar progress={progress} />
      <Box className={styles.formContainer}>
        <Typography variant="h4">Past your link</Typography>
        <Rows
          rows={rows}
          onLangChange={handleLangChange}
          onLinkChange={handleLinkChange}
          onRowDelete={deleteRow}
        />
        <Stack direction="row" spacing={2} className={styles.buttonsContainer}>
          <Button variant="contained" onClick={addRow}>
            Add more
          </Button>
          {hasValidRows ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitClick}
              disabled={loading}
            >
              Send
            </Button>
          ) : (
            <Tooltip title="All fields should be specified">
              <Button
                variant="contained"
                color="primary"
                disabled={!hasValidRows}
              >
                Send
              </Button>
            </Tooltip>
          )}
        </Stack>
      </Box>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={2000}
        onClose={cleanErrorMessage}
        message={errorMessage}
      />
      {!!hasAddedAssets && (
        <Paper className={styles.successMessage}>
          <Alert severity="success">Successfully added asset</Alert>
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
