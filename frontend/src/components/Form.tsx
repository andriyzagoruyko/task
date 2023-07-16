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
import { IRow, Rows } from "./Rows";
import { useAppContext } from "../context";
import { makeRequest } from "../helpers/makeRequest";
import { ApiRouteEnum } from "../definitions/api-routes";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

const EMPTY_ROW = {
  fileUrl: "",
  lang: "",
  isLinkValid: false,
  isLangValid: false,
  isTouched: false,
};

export function Form() {
  const styles = useStyles();
  const [rows, setRows] = useState<IRow[]>([EMPTY_ROW]);

  const createAsset = async (row: IRow) => {
    const { fileUrl, lang } = row;
    await makeRequest(ApiRouteEnum.ENQUEUE_FILE, "POST", { fileUrl, lang });
  };

  const enqueueRows = async () => {
    for (const row of rows) {
      await createAsset(row);
    }
  };

  const updateRow = (index: number, updatedItem: IRow) => {
    const nextItems = [...rows];
    nextItems[index] = updatedItem;
    setRows(nextItems);
    validateRow(index, nextItems[index]);
  };

  const handleAddRow = () => setRows([...rows, EMPTY_ROW]);

  const handleLinkChange = (index: number, fileLink: string) =>
    updateRow(index, { ...rows[index], fileUrl: fileLink });

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
      isLinkValid: !!item.fileUrl.match(URL_REGEX),
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
        <Rows
          rows={rows}
          onLangChange={handleLangChange}
          onLinkChange={handleLinkChange}
          onRowDelete={handleDeleteRow}
        />
        <Stack direction="row" spacing={2} className={styles.buttonsContainer}>
          <Button variant="contained" onClick={handleAddRow}>
            Add more
          </Button>
          {hasValidRows ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => enqueueRows()}
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
});
