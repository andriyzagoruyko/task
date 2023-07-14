import { Box, Button, Paper, TextField, Typography } from "@material-ui/core";
import "./Form.scss";
import Autocomplete from "@mui/material/Autocomplete";

export function Form() {
  return (
    <>
      <Box className="formContainer">
        <Box>
          <Typography variant="h2">Past your link</Typography>
          <Paper className="formPaper">
            <TextField className="field" label="File link" />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["UKR", "EN"]}
              sx={{ width: 120 }}
              renderInput={(params) => (
                <TextField {...params} label="Language" />
              )}
            />
            <Button className="button" variant="contained">
              Submit
            </Button>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
