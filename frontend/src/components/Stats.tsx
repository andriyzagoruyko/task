import { Paper } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { ApiRouteEnum } from "../definitions/api-routes";
import { makeRequest } from "../helpers/makeRequest";

interface IStats {
  totalSize: number;
  count: number;
}

const bytesToMegabytes = (bytes: number) => (bytes / 1000000).toFixed(3);

export function Stats() {
  const styles = useStyles();
  const [stats, setStats] = useState<IStats>({ totalSize: 0, count: 0 });

  useEffect(() => {
    makeRequest(ApiRouteEnum.STATS, "GET").then(setStats).catch(console.log);
  }, [setStats]);

  return (
    <Paper className={styles.wrapper}>
      <Alert severity="info">
        <AlertTitle>Stats</AlertTitle>
        Data processed for the past month —{" "}
        <strong>{bytesToMegabytes(stats.totalSize)} MB</strong> <br />
        Assets quantity for the past month —{" "}
        <strong>{stats.count} items</strong>
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
