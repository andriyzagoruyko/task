import { IconButton, Paper, TextField } from "@material-ui/core";
import { Stack, Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createUseStyles } from "react-jss";
import { AVAILABLE_LANGUAGES } from "../../definitions/available-languages";
import { RowInterface } from "./interfaces/row.interface";
import React from "react";

interface RowsPropsInterface {
  rows: RowInterface[];
  onRowDelete: (index: number) => void;
  onLinkChange: (index: number, link: string) => void;
  onLangChange: (index: number, lang: string) => void;
}

export const Rows: React.FC<RowsPropsInterface> = ({
  rows,
  onRowDelete,
  onLangChange,
  onLinkChange,
}) => {
  const styles = useStyles();
  return (
    <>
      {rows.map((row, index) => (
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center" }}
          key={index}
        >
          <IconButton
            onClick={() => onRowDelete(index)}
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
              value={row.url}
              onChange={({ target }) => onLinkChange(index, target.value)}
            />
            <Autocomplete
              value={row.lang}
              onChange={(_, value) => onLangChange(index, value ?? "")}
              disablePortal
              options={AVAILABLE_LANGUAGES}
              sx={{ minWidth: 125, marginLeft: 1 }}
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
    </>
  );
};

const useStyles = createUseStyles({
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
});
