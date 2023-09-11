import { Box, Typography } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import { AssetCard, IAsset } from "./AssetCard";
import { Stats } from "../Stats";
import { useQuery } from "@apollo/client";
import { ALL_FILES } from "../../apollo/file";

export function Assets() {
  const { loading, data } = useQuery<{ assets: IAsset[] }>(ALL_FILES);
  const styles = useStyles();

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
        {data?.assets?.map((asset: IAsset) => (
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
