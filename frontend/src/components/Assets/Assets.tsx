import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { createUseStyles } from "react-jss";
import { AssetCard, IAsset } from "./AssetCard";
import { ApiRouteEnum } from "../../definitions/api-routes";
import { useEffect, useState } from "react";
import { makeRequest } from "../../helpers/makeRequest";
import { Stats } from "../Stats";

export function Assets() {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    makeRequest(ApiRouteEnum.FILES, "GET")
      .then(setAssets)
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, [setAssets]);

  const styles = useStyles();

  if (isLoading) {
    return (
      <Box className={styles.container}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!assets.length && !isLoading) {
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
        {!assets ? <Typography>loading</Typography> : null}
        {assets?.map((asset) => (
          <Box className={styles.assetWrapper}>
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
