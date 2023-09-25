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
import { FileEntityInterface } from "./interfaces/file-entity.interface";
import { FileTypeEnum } from "./enums/file-type.enum";
import { TaskStatusEnum } from "./enums/task-status.enum";
import { FileEntity } from "../../generated";

const PLACEHOLDER = "/placeholder.jpg";

const StatusColors = {
  [TaskStatusEnum.PENDING]: "default",
  [TaskStatusEnum.DOWNLOADING]: "default",
  [TaskStatusEnum.PROCESSING]: "default",
  [TaskStatusEnum.READY]: "primary",
  [TaskStatusEnum.FAILED]: "secondary",
};

export const FileCard: React.FC<FileEntity> = ({
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
                color={
                  task?.status &&
                  (StatusColors[task.status as TaskStatusEnum] as any)
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
              {size && (
                <Typography variant="caption" component="div">
                  {size / 1000} kB
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        className={styles.filesBody}
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
          task?.status as TaskStatusEnum
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
  filesBody: {},
  "@media screen and (min-width: 0px)": {
    filesBody: {
      alignItems: "center",
    },
    "@media screen and (min-width: 600px)": {
      filesBody: {
        alignItems: "stretch",
      },
    },
  },
});
