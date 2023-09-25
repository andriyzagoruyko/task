import { Paper } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { createUseStyles } from "react-jss";
import { useGetStatsQuery } from "../generated";

const bytesToMegabytes = (bytes: number) => (bytes / 1000000).toFixed(3);

export function Stats() {
  const styles = useStyles();
  const { data } = useGetStatsQuery();

  return (
    <Paper className={styles.wrapper}>
      <Alert severity="info">
        <AlertTitle>Stats</AlertTitle>
        Data processed for the past month —{" "}
        <strong>{bytesToMegabytes(data?.stats?.totalSize ?? 0)} MB</strong>{" "}
        <br />
        Files quantity for the past month —{" "}
        <strong>{data?.stats?.count ?? 0} items</strong>
      </Alert>
    </Paper>
  );
}

const useStyles = createUseStyles({
  wrapper: {
    margin: " 30px 0 30px 0",
    alignSelf: "center",
  },
});
