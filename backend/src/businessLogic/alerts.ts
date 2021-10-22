import { AlertItem } from "../models/AlertItem";
import { AlertsAccess } from "../dataLayer/alertsAccess";
import { CreateAlertRequest } from "../requests/CreateAlertRequest";
import { UpdateAlertRequest } from "../requests/UpdateAlertRequest";
// import { getUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";

const logger = createLogger("alerts");

const alertsAccess = new AlertsAccess();

export async function createAlert(
  newAlert: CreateAlertRequest,
  userId: string
): Promise<AlertItem> {
  logger.info("Creating a alert in businessLogic");
  const alertId = uuid.v4();
  const createdAt = new Date().toISOString();
  const alertItem: AlertItem = {
    userId,
    alertId,
    createdAt,
    cryptoId: newAlert.cryptoId,
    priceThreshold: newAlert.priceThreshold,
    errorMargin: newAlert.errorMargin,
    isActive: true,
  };

  logger.info("Creating alert", alertItem);
  await alertsAccess.createAlert(alertItem);
  logger.info("Alert was created");
  return alertItem;
}

export async function getAlertsForUser(userId: string): Promise<AlertItem[]> {
  logger.info("Getting alerts for user", userId);
  return await alertsAccess.getAlerts(userId);
}

// Update an alert
export async function updateAlert(
  userId: string,
  alertId: string,
  updatedAlert: UpdateAlertRequest
): Promise<void> {
  logger.info("Updating alert", alertId);
  await alertsAccess.updateAlert(userId, alertId, updatedAlert);
  logger.info("Alert was updated");
}

export async function deleteAlert(
  userId: string,
  alertId: string
): Promise<boolean> {
  try {
    logger.info(`Deleting alert ${alertId} for user ${userId}`);
    await alertsAccess.deleteAlert(userId, alertId);
    logger.info(`Alert ${alertId} for user ${userId} was deleted`);
    return true;
  } catch (e) {
    logger.error(`Error while deleting alert ${alertId} for user ${userId}`);
    logger.error(e);
  }
  return false;
}

export async function getAllActiveAlerts(): Promise<AlertItem[]> {
  logger.info("Getting all active alerts");
  return await alertsAccess.getActiveAlerts();
}

export async function getActiveAlertsByCryptoId(
  cryptoId: string
): Promise<AlertItem[]> {
  logger.info("Getting active alerts by cryptoId", cryptoId);
  return await alertsAccess.getActiveAlertsByCryptoId(cryptoId);
}
