import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { getUserIdWss } from "../utils";
import { createLogger } from "../../utils/logger";

let XAWS = null;
if (process.env.IS_OFFLINE) {
  XAWS = AWS;
} else {
  XAWS = AWSXRay.captureAWS(AWS);
}

const docClient = new XAWS.DynamoDB.DocumentClient();

const connectionsTable = process.env.CONNECTIONS_TABLE;
const logger = createLogger("websocket connect");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Incoming websocket event", event);
  // Get current user id

  // const userId = "4295b180-360a-4f18-ac18-fa7c870aae89"; // TODO: Get user id from event
  const userId = getUserIdWss(event);

  const connectionId = event.requestContext.connectionId;
  const timestamp = new Date().toISOString();

  const item = {
    id: connectionId,
    userId,
    timestamp,
  };

  logger.info("Storing item", item);

  await docClient
    .put({
      TableName: connectionsTable,
      Item: item,
    })
    .promise();

  return {
    statusCode: 200,
    body: "",
  };
};
