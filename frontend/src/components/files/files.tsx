import { Box, Typography } from "@material-ui/core";
import { createUseStyles } from "react-jss";
import { FileCard } from "./files-card";
import { Stats } from "../stats";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { useWebsocketEvent } from "../../api/use-websocket-event";
import { WebsocketEventsEnum } from "../../api/websocket-events-enum";
import { useEffect } from "react";
import { FileEntityInterface } from "./interfaces/file-entity.interface";
import { RecognitionTaskInterface } from "./interfaces/recognition-task.interface";
import { useGetFilesQuery } from "../../generated";

export function Files() {
  const styles = useStyles();
  const client = useApolloClient();
  const { loading, data } = useGetFilesQuery();
  const { data: task } = useWebsocketEvent<RecognitionTaskInterface>(
    WebsocketEventsEnum.RecognitionTaskUpdated
  );

  useEffect(() => {
    if (task) {
      client.writeFragment({
        id: `FileEntity:${task.fileId}`,
        fragment: gql`
          fragment file on FileEntity {
            task {
              progress
              status
              result
              error
            }
          }
        `,
        data: {
          task: {
            ...task,
            __typename: "RecognitionTaskEntity",
          },
        },
      });
    }
  }, [client, task]);

  if (loading) {
    return (
      <Box className={styles.container}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!data?.files?.length && !loading) {
    return (
      <Box className={styles.container}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          There are no files at the moment
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" style={{ textAlign: "center" }}>
        Files
      </Typography>
      <Stats />
      <Box className={styles.assetWrapper}>
        {loading ? <Typography>loading</Typography> : null}
        {data?.files?.map((asset) => (
          <Box className={styles.assetWrapper} key={asset.id}>
            <FileCard {...asset} />
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
