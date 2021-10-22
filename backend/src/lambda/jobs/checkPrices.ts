// Lambda function that checks the prices of cryptocurrency using coingecko API
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import CoinGecko from "coingecko-api";
import { getActiveAlertsByCryptoId } from "../../businessLogic/alerts";
import { AlertItem } from "../../models/AlertItem";

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
  cryptoAlerts.forEach((alert: AlertItem) => {
    alert = alert[0];
    const crypto = alert.cryptoId;
    const alertPrice = alert.priceThreshold;
    const currentPrice = prices.find(
      (price) => price.cryptoId === crypto
    ).price;
    if (currentPrice > alertPrice) {
      console.log(
        `Current price of ${crypto} is greater than the alert price of ${alertPrice}`
      );
      sendAlert(alert);
    }
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
  // Send an alert to the user
  console.log("Sending alert to user: ", alert.userId);
}
