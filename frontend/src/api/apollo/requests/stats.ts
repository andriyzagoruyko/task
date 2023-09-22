import { gql } from "@apollo/client";

export const STATS = gql`
  query getStats {
    stats {
      totalSize
      count
    }
  }
`;
