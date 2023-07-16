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
import { AssetCard, FileStatusEnum, FileTypeEnum, IAsset } from "./AssetCard";
import { ApiRouteEnum } from "../definitions/api-routes";
import useSWR from "swr";
import { fetcher } from "../definitions/fetcher";
import { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { makeRequest } from "../helpers/makeRequest";

const mockAssets = [
  {
    name: "test.png",
    status: FileStatusEnum.READY,
    url: "https://previews.123rf.com/images/happyroman/happyroman1611/happyroman161100004/67968361-atm-transaction-printed-paper-receipt-bill-vector.jpg",
    size: 2000,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    error: null,
    createdAt: "01.06.1996",
    type: "image" as FileTypeEnum,
  },
  {
    name: "test.png",
    status: FileStatusEnum.FAILED,
    url: "https://previews.123rf.com/images/happyroman/happyroman1611/happyroman161100004/67968361-atm-transaction-printed-paper-receipt-bill-vector.jpg",
    size: 2000,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    error: null,
    createdAt: "01.06.1996",
    type: "image" as FileTypeEnum,
  },
  {
    name: "test.png",
    status: FileStatusEnum.PROCESSING,
    url: "https://previews.123rf.com/images/happyroman/happyroman1611/happyroman161100004/67968361-atm-transaction-printed-paper-receipt-bill-vector.jpg",
    size: 2000,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    error: null,
    createdAt: "01.06.1996",
    type: "image" as FileTypeEnum,
  },
  {
    name: "test.png",
    status: FileStatusEnum.SAVED,
    url: "https://previews.123rf.com/images/happyroman/happyroman1611/happyroman161100004/67968361-atm-transaction-printed-paper-receipt-bill-vector.jpg",
    size: 2000,
    text: null,
    error: null,
    createdAt: "01.06.1996",
    type: "audio" as FileTypeEnum,
  },
];

export function Assets() {
  const { assets, setAssets } = useAppContext();

  useEffect(() => {
    makeRequest(ApiRouteEnum.FILES, "GET").then(setAssets).catch(console.log);
  }, [setAssets]);

  const styles = useStyles();

  if (!assets) {
    return <>loading</>;
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" style={{ textAlign: "center" }}>
        Assets
      </Typography>
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
    margin: " 16px 0 16px 0",
  },
});
