import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { createUseStyles } from "react-jss";

import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

const EMPTY_ROW = {
  fileLink: "",
  lang: "",
  isLinkValid: false,
  isLangValid: false,
  isTouched: false,
};

interface IRow {
  fileLink: string;
  lang: string;
  isLinkValid: boolean;
  isLangValid: boolean;
  isTouched: boolean;
}

export function Form() {
  const styles = useStyles();
  const [rows, setRows] = useState<IRow[]>([EMPTY_ROW]);

  const updateRow = (index: number, updatedItem: IRow) => {
    const nextItems = [...rows];
    nextItems[index] = updatedItem;
    setRows(nextItems);
    validateRow(index, nextItems[index]);
  };

  const handleAddRow = () => setRows([...rows, EMPTY_ROW]);

  const handleLinkChange = (index: number, fileLink: string) =>
    updateRow(index, { ...rows[index], fileLink });

  const handleLangChange = (index: number, lang: string) =>
    updateRow(index, { ...rows[index], lang });

  const handleDeleteRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const validateRow = (index: number, item: IRow) => {
    const nextItems = [...rows];
    nextItems[index] = {
      ...item,
      isLinkValid: !!item.fileLink.match(URL_REGEX),
      isLangValid: !!item.lang,
      isTouched: true,
    };
    setRows(nextItems);
  };

  const hasValidRows = rows.every((row) => row.isLinkValid && row.isLangValid);

  return (
    <>
      <Box className={styles.formContainer}>
        <Typography variant="h4">Past your link</Typography>
        {rows.map((row, index) => (
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconButton
              onClick={() => handleDeleteRow(index)}
              disabled={rows.length <= 1}
            >
              <DeleteIcon />
            </IconButton>
            <Paper className={styles.formRow}>
              <TextField
                error={!row.isLinkValid && row.isTouched}
                className={styles.field}
                label={
                  !row.isLinkValid && row.isTouched
                    ? "Link is not valid"
                    : "File link"
                }
                value={row.fileLink}
                onChange={({ target }) => handleLinkChange(index, target.value)}
              />
              <Autocomplete
                onChange={(_, value) => handleLangChange(index, value ?? "")}
                disablePortal
                options={["UKR", "EN"]}
                sx={{ minWidth: 100 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!row.isLangValid && row.isTouched}
                    label="Language"
                  />
                )}
              />
            </Paper>
          </Stack>
        ))}
        <Stack direction="row" spacing={2} className={styles.buttonsContainer}>
          <Button variant="contained" onClick={handleAddRow}>
            Add more
          </Button>
          {hasValidRows ? (
            <Button variant="contained" color="primary">
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
  formRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 16,
    margin: "16px 0 16px 0!important",
    width: "100%",
  },
  field: {
    flexGrow: 2,
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
});
