import type { AWS } from "@serverless/typescript";
import createAlertModel from "./models/create-alert-model";
import updateAlertModel from "./models/update-alert-model";
// import hello from "@functions/hello";

const serverlessConfiguration: AWS = {
  service: "backend",
  frameworkVersion: "2",
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
    },
    "serverless-offline": {
      port: 3003,
    },
    dynamodb: {
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
      stages: ["dev", "prod"],
    },
  },
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dynamodb-local",
    "serverless-iam-roles-per-function",
  ],
  provider: {
    name: "aws",
    region: "us-east-1",
    stage: process.env.stage || "dev",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      // ALERTS_TABLE: `${process.env.ALERTS_TABLE}-${process.env.stage || "dev"}`,
      ALERTS_TABLE: "alerts-dev",
      CONNECTIONS_TABLE: "connections-dev",
    },
    lambdaHashingVersion: "20201221",
    tracing: {
      lambda: true,
      apiGateway: true,
    },
    logs: {
      restApi: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["xray:PutTelemtryRecords", "xray:PutTraceSegments"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}",
              "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}/index/*",
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    checkPrices: {
      handler: "./src/lambda/jobs/checkPrices.handler",
      events: [{ schedule: "rate(1 minute)" }],
      environment: {
        STAGE: "${self:provider.stage}",
        API_ID: {
          Ref: "WebsocketsApi",
        },
      },
      // @ts-expect-error: Let's ignore a single compiler
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:Query", "dynamodb:DeleteItem"],
          Resource: [
            "arn:aws:dynamodb:*:*:table/${self:provider.environment.ALERTS_TABLE}",
            "arn:aws:dynamodb:*:*:table/${self:provider.environment.ALERTS_TABLE}/index/*",
            "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}",
            "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}/index/*",
          ],
        },
        {
          Effect: "Allow",
          Action: ["execute-api:ManageConnections", "execute-api:Invoke"],
          Resource: ["arn:aws:execute-api:*:*:*"],
        },
      ],
    },
    getAlerts: {
      handler: "./src/lambda/http/getAlerts.handler",
      events: [
        {
          http: {
            method: "get",
            path: "alert",
            cors: true,
          },
        },
      ],
      // @ts-expect-error: Let's ignore a single compiler
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:Query"],
          Resource: [
            "arn:aws:dynamodb:*:*:table/${self:provider.environment.ALERTS_TABLE}",
          ],
        },
      ],
    },
    createAlert: {
      handler: "./src/lambda/http/createAlert.handler",
      events: [
        {
          http: {
            method: "post",
            path: "alert",
            cors: true,
            request: {
              schema: {
                "application/json": createAlertModel,
              },
            },
          },
        },
      ],
      // @ts-expect-error: Let's ignore a single compiler
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:PutItem"],
          Resource: [
            "arn:aws:dynamodb:*:*:table/${self:provider.environment.ALERTS_TABLE}",
          ],
        },
      ],
    },
    updateAlert: {
      handler: "./src/lambda/http/updateAlert.handler",
      events: [
        {
          http: {
            method: "patch",
            path: "alert/{alertId}",
            cors: true,
            request: {
              schema: {
                "application/json": updateAlertModel,
              },
            },
          },
        },
      ],
      // @ts-expect-error: Let's ignore a single compiler
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:UpdateItem"],
          Resource: [
            "arn:aws:dynamodb:*:*:table/${self:provider.environment.ALERTS_TABLE}",
          ],
        },
      ],
    },
    deleteAlert: {
      handler: "./src/lambda/http/deleteAlert.handler",
      events: [
        {
          http: {
            method: "delete",
            path: "alert/{alertId}",
            cors: true,
          },
        },
      ],
      // @ts-expect-error: Let's ignore a single compiler
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:DeleteItem"],
          Resource: [
            "arn:aws:dynamodb:*:*:table/${self:provider.environment.ALERTS_TABLE}",
          ],
        },
      ],
    },
    // Websocket handling
    ConnectHandler: {
      handler: "./src/lambda/websocket/connect.handler",
      events: [
        {
          websocket: {
            route: "$connect",
          },
        },
      ],
    },
    DisconnectHandler: {
      handler: "./src/lambda/websocket/disconnect.handler",
      events: [
        {
          websocket: {
            route: "$disconnect",
          },
        },
      ],
    },
  },

  resources: {
    Resources: {
      AlertsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.ALERTS_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "userId",
              AttributeType: "S",
            },
            {
              AttributeName: "alertId",
              AttributeType: "S",
            },
            {
              AttributeName: "createdAt",
              AttributeType: "S",
            },
            {
              AttributeName: "cryptoId",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "userId",
              KeyType: "HASH",
            },
            {
              AttributeName: "alertId",
              KeyType: "RANGE",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
          LocalSecondaryIndexes: [
            {
              IndexName: "createdAt-index",
              KeySchema: [
                {
                  AttributeName: "userId",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "createdAt",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
          // Create a Global Secondary Index to allow querying by cryptoId as partition key and isActive as sort key
          GlobalSecondaryIndexes: [
            {
              IndexName: "cryptoIdGSI-index",
              KeySchema: [
                {
                  AttributeName: "cryptoId",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "createdAt",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },

      WebSocketConnectionsDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.CONNECTIONS_TABLE}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "userId",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
            {
              AttributeName: "userId",
              KeyType: "RANGE",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: [
            {
              IndexName: "userIdGSI-index",
              KeySchema: [
                {
                  AttributeName: "userId",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "id",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
