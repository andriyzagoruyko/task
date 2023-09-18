import { gql } from "@apollo/client";

export const ALL_FILES = gql`
  query allFiles {
    assets: allFiles {
      id
      name
      status
      type
      size
      url
      text
      task {
        id
        progress
        fileId
      }
    }
  }
`;

export const ENQUEUE_FILE = gql`
  mutation enqueueFile($url: String!, $lang: String!) {
    newAsset: enqueueFile(enqueueFileInput: { url: $url, lang: $lang }) {
      id
      name
      status
      type
      size
      url
      text
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
    }
  }
`;

export const FILE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    fileUpdated {
      id
      name
      status
      type
      size
      url
      text
      task {
        id
        progress
        fileId
      }
    }
  }
`;
