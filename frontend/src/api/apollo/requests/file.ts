import { gql } from "@apollo/client";

export const ALL_FILES = gql`
  query allFiles {
    assets: allFiles {
      id
      name
      type
      size
      url
      task {
        id
        progress
        fileId
        status
        result
        error
      }
    }
  }
`;

export const ENQUEUE_FILE = gql`
  mutation enqueueFile($url: String!, $lang: String!) {
    newAsset: enqueueFile(enqueueFileInput: { url: $url, lang: $lang }) {
      id
      name
      type
      size
      url
    }
  }
`;

export const STATS = gql`
  query getStats {
    stats {
      totalSize
      count
    }
  }
`;

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription {
    taskUpdated {
      id
      fileId
      progress
      status
      result
    }
  }
`;
