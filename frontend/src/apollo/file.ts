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
    }
  }
`;

export const ENQUEUE_FILE = gql`
  mutation enqueueFile($url: String!, $lang: String!, $socketId: ID) {
    newAsset: enqueueFile(
      enqueueFileInput: { url: $url, lang: $lang, socketId: $socketId }
    ) {
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
