import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";

import { AlertItem } from "../models/AlertItem";
import { AlertUpdate } from "../models/AlertUpdate";
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

  // Get all active Alerts using a scan operation and filtering only the active ones
  async getActiveAlerts(): Promise<AlertItem[]> {
    logger.info("Getting all active alerts");
    const result = await this.docClient
      .scan({
        TableName: this.alertsTable,
        FilterExpression: "isActive = :active",
        ExpressionAttributeValues: {
          ":active": true,
        },
      })
      .promise();
    return result.Items as AlertItem[];
  }

  // Get all active Alerts by cryptoId as partition key and filtering only the active ones
  async getActiveAlertsByCryptoId(cryptoId: string): Promise<AlertItem[]> {
    logger.info("Getting all active alerts by cryptoId");
    const result = await this.docClient
      .query({
        TableName: this.alertsTable,
        IndexName: "cryptoIdGSI-index",
        KeyConditionExpression: "cryptoId = :cryptoId",
        FilterExpression: "isActive = :active",
        ExpressionAttributeValues: {
          ":cryptoId": cryptoId,
          ":active": true,
        },
      })
      .promise();
    return result.Items as AlertItem[];
  }

  async getAlerts(userId: string): Promise<AlertItem[]> {
    logger.info("Getting alerts for user", userId);
    const result = await this.docClient
      .query({
        TableName: this.alertsTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    return result.Items as AlertItem[];
  }

  async updateAlert(
    userId: string,
    alertId: string,
    updatedAlert: AlertUpdate
  ): Promise<AlertUpdate> {
    logger.info("Updating alert", alertId);
    await this.docClient
      .update({
        TableName: this.alertsTable,
        Key: {
          userId: userId,
          alertId: alertId,
        },
        UpdateExpression:
          "set cryptoId = :cryptoId, priceThreshold = :priceThreshold, errorMargin = :errorMargin, isActive = :isActive",
        ExpressionAttributeValues: {
          ":cryptoId": updatedAlert.cryptoId,
          ":priceThreshold": updatedAlert.priceThreshold,
          ":errorMargin": updatedAlert.errorMargin,
          ":isActive": updatedAlert.isActive,
        },
      })
      .promise();
    return updatedAlert;
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
