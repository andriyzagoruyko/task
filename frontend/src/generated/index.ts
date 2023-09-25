import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  MongoID: { input: any; output: any; }
};

export type EnqueueFileInput = {
  lang: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type FileEntity = {
  __typename?: 'FileEntity';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lang: Scalars['String']['output'];
  name: Scalars['String']['output'];
  size?: Maybe<Scalars['Int']['output']>;
  task?: Maybe<RecognitionTaskEntity>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  enqueueFile: FileEntity;
};


export type MutationEnqueueFileArgs = {
  enqueueFileInput: EnqueueFileInput;
};

export type Query = {
  __typename?: 'Query';
  file: FileEntity;
  files: Array<FileEntity>;
  recognitionTask: RecognitionTaskEntity;
  recognitionTasks: Array<RecognitionTaskEntity>;
  stats: StatsDto;
};


export type QueryFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecognitionTaskArgs = {
  id: Scalars['ID']['input'];
};

export type RecognitionTaskEntity = {
  __typename?: 'RecognitionTaskEntity';
  error?: Maybe<Scalars['String']['output']>;
  file?: Maybe<FileEntity>;
  fileId: Scalars['ID']['output'];
  id: Scalars['MongoID']['output'];
  progress: Scalars['Float']['output'];
  result?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type StatsDto = {
  __typename?: 'StatsDto';
  count: Scalars['Int']['output'];
  totalSize: Scalars['Int']['output'];
};

export type EnqueueFileMutationVariables = Exact<{
  url: Scalars['String']['input'];
  lang: Scalars['String']['input'];
}>;


export type EnqueueFileMutation = { __typename?: 'Mutation', file: { __typename?: 'FileEntity', id: string, name: string, type: string, size?: number | null, url: string } };

export type GetFilesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFilesQuery = { __typename?: 'Query', files: Array<{ __typename?: 'FileEntity', id: string, name: string, type: string, size?: number | null, url: string, lang: string, createdAt: string, updatedAt: string, task?: { __typename?: 'RecognitionTaskEntity', id: any, progress: number, fileId: string, status: string, result?: string | null, error?: string | null } | null }> };

export type GetStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatsQuery = { __typename?: 'Query', stats: { __typename?: 'StatsDto', totalSize: number, count: number } };


export const EnqueueFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnqueueFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"file"},"name":{"kind":"Name","value":"enqueueFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enqueueFileInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lang"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
export type EnqueueFileMutationFn = Apollo.MutationFunction<EnqueueFileMutation, EnqueueFileMutationVariables>;

/**
 * __useEnqueueFileMutation__
 *
 * To run a mutation, you first call `useEnqueueFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnqueueFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enqueueFileMutation, { data, loading, error }] = useEnqueueFileMutation({
 *   variables: {
 *      url: // value for 'url'
 *      lang: // value for 'lang'
 *   },
 * });
 */
export function useEnqueueFileMutation(baseOptions?: Apollo.MutationHookOptions<EnqueueFileMutation, EnqueueFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnqueueFileMutation, EnqueueFileMutationVariables>(EnqueueFileDocument, options);
      }
export type EnqueueFileMutationHookResult = ReturnType<typeof useEnqueueFileMutation>;
export type EnqueueFileMutationResult = Apollo.MutationResult<EnqueueFileMutation>;
export type EnqueueFileMutationOptions = Apollo.BaseMutationOptions<EnqueueFileMutation, EnqueueFileMutationVariables>;
export const GetFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"fileId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetFilesQuery__
 *
 * To run a query within a React component, call `useGetFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFilesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFilesQuery(baseOptions?: Apollo.QueryHookOptions<GetFilesQuery, GetFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFilesQuery, GetFilesQueryVariables>(GetFilesDocument, options);
      }
export function useGetFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFilesQuery, GetFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFilesQuery, GetFilesQueryVariables>(GetFilesDocument, options);
        }
export type GetFilesQueryHookResult = ReturnType<typeof useGetFilesQuery>;
export type GetFilesLazyQueryHookResult = ReturnType<typeof useGetFilesLazyQuery>;
export type GetFilesQueryResult = Apollo.QueryResult<GetFilesQuery, GetFilesQueryVariables>;
export const GetStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalSize"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetStatsQuery__
 *
 * To run a query within a React component, call `useGetStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetStatsQuery, GetStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
      }
export function useGetStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStatsQuery, GetStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
        }
export type GetStatsQueryHookResult = ReturnType<typeof useGetStatsQuery>;
export type GetStatsLazyQueryHookResult = ReturnType<typeof useGetStatsLazyQuery>;
export type GetStatsQueryResult = Apollo.QueryResult<GetStatsQuery, GetStatsQueryVariables>;