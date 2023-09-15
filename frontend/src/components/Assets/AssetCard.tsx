import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  PropTypes,
  Typography,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import React from "react";
import { createUseStyles } from "react-jss";

export interface IAsset {
  id: number;
  name: string;
  status: FileStatusEnum;
  url: string;
  size: number;
  text: string | null;
  error: string | null;
  createdAt: string;
  type: FileTypeEnum;
}

export enum FileTypeEnum {
  IMAGE = "image",
  AUDIO = "audio",
}

export enum FileStatusEnum {
  SAVED = "saved",
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

const StatusColors = {
  [FileStatusEnum.SAVED]: undefined,
  [FileStatusEnum.PROCESSING]: undefined,
  [FileStatusEnum.READY]: "primary",
  [FileStatusEnum.FAILED]: "secondary",
};

const PLACEHOLDER = "/placeholder.jpg";

export const AssetCard: React.FC<IAsset> = ({
  name,
  status,
  url,
  size,
  text,
  error,
  createdAt,
  type,
}) => {
  const styles = useStyles();
  return (
    <Card>
      <Box>
        <CardContent>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Stack
              direction="column"
              alignItems={{ xs: "center", sm: "flex-start" }}
              flexGrow={1}
              spacing={1}
            >
              <Typography component="div" variant="subtitle2">
                {name}
              </Typography>
              <Chip
                label={status}
                size="small"
                color={
                  StatusColors[status] as Exclude<PropTypes.Color, "inherit">
                }
              />
            </Stack>
            <Stack
              alignItems="end"
              direction={{ xs: "row", md: "column" }}
              spacing={1}
              style={{ padding: 5 }}
            >
              <Typography variant="caption" component="div">
                Type: {type}
              </Typography>
              <Typography variant="caption" component="div">
                {size / 1000} kB
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        className={styles.assetsBody}
      >
        <Box className={styles.assetPreview}>
          <CardMedia
            component="img"
            image={type === FileTypeEnum.IMAGE ? url : PLACEHOLDER}
          />
        </Box>
        <Typography component="p" className={styles.assetText} variant="body2">
          {error ??
            text ??
            "There is no saved text at the moment. Probably the asset is in processing or the asset has no text"}
        </Typography>
      </Stack>
    </Card>
  );
};

const useStyles = createUseStyles({
  assetPreview: {
    maxWidth: 100,
    width: "100%",
    padding: "10px",
  },
  assetText: {
    padding: "10px",
  },
  assetsBody: {},
  "@media screen and (min-width: 0px)": {
    assetsBody: {
      alignItems: "center",
    },
    "@media screen and (min-width: 600px)": {
      assetsBody: {
        alignItems: "stretch",
      },
    },
  },
});
