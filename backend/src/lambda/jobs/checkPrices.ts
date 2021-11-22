// Lambda function that checks the prices of cryptocurrency using coingecko API
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

import CoinGecko from "coingecko-api";

import { getActiveAlertsByCryptoId } from "../../businessLogic/alerts";
import { AlertItem } from "../../models/AlertItem";

let XAWS = null;
if (process.env.IS_OFFLINE) {
  XAWS = AWS;
} else {
  XAWS = AWSXRay.captureAWS(AWS);
}

// Env vars
const connectionsTable = process.env.CONNECTIONS_TABLE;
const stage = process.env.STAGE;
const apiId = process.env.API_ID;

const connectionParams = {
  apiVersion: "2018-11-29",
  endpoint: `${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`,
};

const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams);
const docClient = new XAWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event: ", event);

  const coinGeckoClient = new CoinGecko();
  const cryptos = ["bitcoin", "cardano"];
  const cryptoAlerts = await getActiveAlerts(cryptos);
  let prices = await getCryptoCurrentPrices(coinGeckoClient, cryptos);
  // console.log("Response: ", response);
  // console.log("Current Prices", response.data.market_data.current_price.usd);
  prices = prices.map((price) => {
    const price_obj = {
      cryptoId: price.data.id,
      price: price.data.market_data.current_price.usd,
    };
    return price_obj;
  });
  console.log("Current prices", prices);
  console.log("Crypto Alerts", cryptoAlerts);
  // For each crypto, check if the current price is greater than the alert price and if so, send an alert
  cryptoAlerts.forEach((alerts: AlertItem[]) => {
    if (alerts.length === 0) {
      return;
    }
    alerts.forEach((alert: AlertItem) => {
      const crypto = alert.cryptoId;
      const alertPrice = alert.priceThreshold;
      const currentPrice = prices.find(
        (price) => price.cryptoId === crypto
      ).price;
      if (currentPrice > alertPrice) {
        console.log(
          `Current price of ${crypto} is greater than the alert price of ${alertPrice}`
        );
        console.log(`${alert.userId}`);
        sendAlert(alert);
      }
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
};

async function getActiveAlerts(cryptoIds: string[]): Promise<any[]> {
  // Make a concurrent call to getActiveAlertsByCryptoId given an array of cryptoIds
  const requests = cryptoIds.map((cryptoId) =>
    getActiveAlertsByCryptoId(cryptoId)
  );
  const alerts = await Promise.all(requests);
  console.log("Alerts: ", alerts);
  return alerts as any;
}

async function getCryptoCurrentPrices(
  client: any,
  cryptoIds: string[]
): Promise<any[]> {
  // Make a concurrent call to coinGecko API given an array of cryptoIds
  let prices = [];
  const requests = cryptoIds.map((cryptoId) => {
    const params = {
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
    };
    return client.coins.fetch(cryptoId, params);
  });

  try {
    prices = await Promise.all(requests);
    console.log("Prices: ", prices);
  } catch (e) {
    console.log("Error: ", e);
  }
  return prices as any;
}

async function sendAlert(alert: AlertItem) {
  console.log("Sending alert to user: ", alert.userId);
  // Send an alert to the user
  const userId = alert.userId;
  // Get the connectionId of the user from connections table using the GSI on userId
  const params = {
    TableName: connectionsTable,
    IndexName: "userIdGSI-index",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };
  const response = await docClient.query(params).promise();
  console.log("Response: ", response);
  const connectionId = response.Items[0]?.id;
  if (!connectionId) {
    console.log("No connectionId found for user: ", userId);
    return;
  }
  console.log("ConnectionId: ", connectionId);
  // Send the alert to the user
  const payload = {
    type: "PRICE_ALERT",
    price: alert.priceThreshold,
    cryptoId: alert.cryptoId,
  };
  await sendMessageToClient(connectionId, userId, payload);
}

async function sendMessageToClient(connectionId, userId, payload) {
  try {
    console.log("Sending message to connection", connectionId);

    await apiGateway
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      })
      .promise();
  } catch (e) {
    console.log("Failed to send message", JSON.stringify(e));
    if (e.statusCode === 410) {
      console.log("Stale connection");
      // Delete stale connection with connectionId and userId
      const params = {
        TableName: connectionsTable,
        Key: {
          id: connectionId,
          userId: userId,
        },
      };
      await docClient.delete(params).promise();
    }
  }
}
