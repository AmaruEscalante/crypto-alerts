import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import middy from "middy";
import { cors } from "middy/middlewares";
import { CreateAlertRequest } from "../../requests/CreateAlertRequest";
import { getUserId } from "../utils";
import { createAlert } from "../../businessLogic/alerts";

// import * as uuid from "uuid";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);

    const newAlert: CreateAlertRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    // const userId = uuid.v4(); // TODO: Remove, this is just for testing
    // const userId = "f814dac8-c665-4df9-8390-fce38a27ea54"; //User aws
    // const userId = "4295b180-360a-4f18-ac18-fa7c870aae89";
    const newItem = await createAlert(newAlert, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
