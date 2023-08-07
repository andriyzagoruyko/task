import { IconButton, Paper, TextField, Typography } from "@material-ui/core";
import { Stack, Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createUseStyles } from "react-jss";
import { AVAILABLE_LANGUAGES } from "../../definitions/available-languages";

export interface IRow {
  fileUrl: string;
  lang: string;
  isLinkValid: boolean;
  isLangValid: boolean;
  isTouched: boolean;
}

interface IRowPros {
  rows: IRow[];
  onRowDelete: (index: number) => void;
  onLinkChange: (index: number, link: string) => void;
  onLangChange: (index: number, lang: string) => void;
}

export const Rows = ({
  rows,
  onRowDelete,
  onLangChange,
  onLinkChange,
}: IRowPros) => {
  const styles = useStyles();
  return (
    <>
      {rows.map((row, index) => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
              value={row.fileUrl}
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
