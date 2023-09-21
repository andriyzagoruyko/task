import { Box, Typography } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import { AssetCard, AssetEntityInterface } from "./asset-card";
import { Stats } from "../stats";
import { useQuery, useSubscription } from "@apollo/client";
import {
  ALL_FILES,
  TASK_UPDATED_SUBSCRIPTION,
} from "../../api/apollo/requests/file";
import { useWebsocketEvent } from "../../api/websocket/use-websocket-event";
import { SocketEventsEnum } from "../../api/websocket/websocket-events-enum";

export function Assets() {
  const styles = useStyles();
  const { loading, data } = useQuery<{ assets: AssetEntityInterface[] }>(
    ALL_FILES
  );
  useSubscription(TASK_UPDATED_SUBSCRIPTION);
  const assetUpdatedData = useWebsocketEvent(
    SocketEventsEnum.RecognitionTaskUpdated
  );
  console.log("-----------------------------------", assetUpdatedData);

  if (loading) {
    return (
      <Box className={styles.container}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!data?.assets?.length && !loading) {
    return (
      <Box className={styles.container}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          There are no assets at the moment
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" style={{ textAlign: "center" }}>
        Assets
      </Typography>
      <Stats />
      <Box className={styles.assetWrapper}>
        {loading ? <Typography>loading</Typography> : null}
        {data?.assets?.map((asset: AssetEntityInterface) => (
          <Box className={styles.assetWrapper} key={asset.id}>
            <AssetCard {...asset} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const useStyles = createUseStyles({
  container: {
    marginTop: 60,
  },
  assetWrapper: {
    margin: "30px 0 30px 0",
  },
});
