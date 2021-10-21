import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { AlertItem } from "../models/AlertItem";
// import { TodoUpdate } from "../models/TodoUpdate";
// import { ProcessCredentials } from 'aws-sdk'

let XAWS = null;
if (process.env.IS_OFFLINE) {
  XAWS = AWS;
} else {
  XAWS = AWSXRay.captureAWS(AWS);
}

const logger = createLogger("AlertsAccess");

export class AlertsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly alertsTable = process.env.ALERTS_TABLE
  ) {}

  async createAlert(alert: AlertItem): Promise<AlertItem> {
    logger.info("Table name is ", this.alertsTable);
    logger.info("Creating a new alert", alert);
    await this.docClient
      .put({
        TableName: this.alertsTable,
        Item: alert,
      })
      .promise();
    return alert;
  }

  async deleteAlert(userId: string, alertId: string): Promise<void> {
    logger.info("Deleting alert", alertId);
    await this.docClient
      .delete({
        TableName: this.alertsTable,
        Key: {
          userId: userId,
          alertId: alertId,
        },
      })
      .promise();
  }

  //   async getTodos(userId: string): Promise<TodoItem[]> {
  //     const result = await this.docClient
  //       .query({
  //         TableName: this.todosTable,
  //         KeyConditionExpression: "userId = :userId",
  //         ExpressionAttributeValues: {
  //           ":userId": userId,
  //         },
  //       })
  //       .promise();

  //     const items = result.Items;
  //     return items as TodoItem[];
  //   }

  //   async updateTodo(
  //     userId: string,
  //     todoId: string,
  //     updatedTodo: TodoUpdate
  //   ): Promise<TodoUpdate> {
  //     await this.docClient
  //       .update({
  //         TableName: this.todosTable,
  //         Key: {
  //           userId,
  //           todoId,
  //         },
  //         UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
  //         ExpressionAttributeValues: {
  //           ":name": updatedTodo.name,
  //           ":dueDate": updatedTodo.dueDate,
  //           ":done": updatedTodo.done,
  //         },
  //         ExpressionAttributeNames: {
  //           "#name": "name",
  //         },
  //       })
  //       .promise();
  //     return updatedTodo;
  //   }

  //   async createTodoAttachment(
  //     userId: string,
  //     todoId: string,
  //     attachmentUrl: string
  //   ): Promise<void> {
  //     await this.docClient
  //       .update({
  //         TableName: this.todosTable,
  //         Key: {
  //           userId,
  //           todoId,
  //         },
  //         UpdateExpression: "set attachmentUrl = :attachmentUrl",
  //         ExpressionAttributeValues: {
  //           ":attachmentUrl": attachmentUrl,
  //         },
  //       })
  //       .promise();
  //   }

  //   async deleteTodo(userId: string, todoId: string): Promise<void> {
  //     await this.docClient
  //       .delete({
  //         TableName: this.todosTable,
  //         Key: {
  //           userId,
  //           todoId,
  //         },
  //       })
  //       .promise();
  //   }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }
  return new XAWS.DynamoDB.DocumentClient();
}
