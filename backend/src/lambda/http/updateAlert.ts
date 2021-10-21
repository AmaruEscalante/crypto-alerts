import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { updateAlert } from "../../businessLogic/alerts";
import { UpdateAlertRequest } from "../../requests/UpdateAlertRequest";
// import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    const alertId = event.pathParameters.alertId;
    const updatedAlertItem: UpdateAlertRequest = JSON.parse(event.body);
    // const userId = getUserId(event);
    const userId = "4295b180-360a-4f18-ac18-fa7c870aae89";
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateAlert(userId, alertId, updatedAlertItem);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: updatedAlertItem,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: false,
  })
);
