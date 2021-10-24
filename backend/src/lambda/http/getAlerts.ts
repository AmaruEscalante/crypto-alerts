import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "middy";
import { cors } from "middy/middlewares";

import { getAlertsForUser } from "../../businessLogic/alerts";
import { getUserId } from "../utils";

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    const userId = getUserId(event);
    // const userId = "4295b180-360a-4f18-ac18-fa7c870aae89";
    const alerts = await getAlertsForUser(userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        items: alerts,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: false,
  })
);
