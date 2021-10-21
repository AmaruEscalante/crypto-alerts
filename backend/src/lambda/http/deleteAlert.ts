import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { deleteAlert } from "../../businessLogic/alerts";
// import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`Processing event ${event}`);
    const alertId = event.pathParameters.alertId;
    // const userId = getUserId(event);
    // const userId = "f814dac8-c665-4df9-8390-fce38a27ea54"; //User aws
    const userId = "4295b180-360a-4f18-ac18-fa7c870aae89"; // local user
    const success = await deleteAlert(userId, alertId);

    if (success) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Alert deleted successfully",
        }),
      };
    } else {
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: "Something went wrong",
        }),
      };
    }
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: false,
  })
);
