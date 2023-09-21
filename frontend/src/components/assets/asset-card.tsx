import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import React from "react";
import { createUseStyles } from "react-jss";

export interface AssetEntityInterface {
  id: number;
  name: string;
  url: string;
  size: number;
  createdAt: string;
  type: FileTypeEnum;
  task?: {
    progress: number;
    status: TaskStatusEnum;
    result: string;
    error: string;
  };
}

export enum FileTypeEnum {
  IMAGE = "image",
  AUDIO = "audio",
}

export enum TaskStatusEnum {
  PENDING = "pending",
  DOWNLOADING = "downloading",
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

const StatusColors = {
  [TaskStatusEnum.PENDING]: "default",
  [TaskStatusEnum.DOWNLOADING]: "default",
  [TaskStatusEnum.PROCESSING]: "default",
  [TaskStatusEnum.READY]: "primary",
  [TaskStatusEnum.FAILED]: "secondary",
};

const PLACEHOLDER = "/placeholder.jpg";

export const AssetCard: React.FC<AssetEntityInterface> = ({
  name,
  url,
  size,
  type,
  task,
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
                label={task?.status}
                size="small"
                color={task?.status && (StatusColors[task.status] as any)}
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
          {task?.error ??
            task?.result ??
            "There is no saved text at the moment. Probably the asset is in processing or the asset has no text"}
        </Typography>
      </Stack>
      {task?.status &&
        [TaskStatusEnum.DOWNLOADING, TaskStatusEnum.PENDING].includes(
          task?.status
        ) && (
          <LinearProgress
            variant="determinate"
            value={task?.progress}
            color="primary"
            style={{ zIndex: 1000 }}
          />
        )}
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