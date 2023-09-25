import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  watch: true,
  schema: process.env.APP_GATEWAY_GRAPHQL_URL,
  documents: "**/*.{gql,graphql}",
  generates: {
    "src/generated/index.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
        //"typed-document-node",
      ],
      config: {
        documentMode: 'documentNode'
      }
    },
  },
  ignoreNoDocuments: true,
};

export default config;
