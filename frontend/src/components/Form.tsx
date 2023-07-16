import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { createUseStyles } from "react-jss";

import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

const EMPTY_ITEM = { fileLink: "", lang: "", isValid: true };

export function Form() {
  const styles = useStyles();
  const [items, setItems] = useState([EMPTY_ITEM]);

  const handleAddItem = () => setItems([...items, EMPTY_ITEM]);

  const handleLinkChange = (index: number, fileLink: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      fileLink,
      isValid: validateLink(fileLink),
    };
    setItems(updatedItems);
  };

  const handleLangChange = (index: number, lang: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], lang };
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const validateLink = (link: string) => {
    return !!link.match(URL_REGEX);
  };

  return (
    <>
      <Box className={styles.formContainer}>
        <Typography variant="h4">Past your link</Typography>
        {items.map((item, index) => (
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconButton
              onClick={() => handleDeleteItem(index)}
              disabled={items.length <= 1}
            >
              <DeleteIcon />
            </IconButton>
            <Paper className={styles.formRow}>
              <TextField
                error={!item.isValid}
                className={styles.field}
                label={!item.isValid ? "Link is not valid" : "File link"}
                value={item.fileLink}
                onChange={({ target }) => handleLinkChange(index, target.value)}
              />
              <Autocomplete
                onChange={(_, value) => handleLangChange(index, value ?? "")}
                disablePortal
                options={["UKR", "EN"]}
                sx={{ minWidth: 100 }}
                renderInput={(params) => (
                  <TextField {...params} label="Language" />
                )}
              />
            </Paper>
          </Stack>
        ))}
        <Stack direction="row" spacing={2} className={styles.buttonsContainer}>
          <Button variant="contained" onClick={handleAddItem}>
            Add more
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={
              !items.some(({ fileLink, lang, isValid }) => isValid && !!lang)
            }
          >
            Send
          </Button>
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
