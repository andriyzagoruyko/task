import { gql } from "@apollo/client";

export const ALL_FILES = gql`
  query allFiles {
    allFiles {
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
    newFile: enqueueFile(enqueueFileInput: { url: $url, lang: $lang }) {
      id
      name
      type
      size
      url
    }
  }
`;
