// Lambda function that checks the prices of cryptocurrency using coingecko API
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import CoinGecko from "coingecko-api";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event: ", event);

  const coinGeckoClient = new CoinGecko();
  const params = {
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
  };
  const response = await coinGeckoClient.coins.fetch("bitcoin", params);
  console.log("Response: ", response);
  console.log("Current Price", response.data.market_data.current_price.usd);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
};
