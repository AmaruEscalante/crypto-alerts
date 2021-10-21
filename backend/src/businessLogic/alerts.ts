import { AlertItem } from "../models/AlertItem";
import { AlertsAccess } from "../dataLayer/alertsAccess";
import { CreateAlertRequest } from "../requests/CreateAlertRequest";
// import { getUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";

const logger = createLogger("alerts");

const alertsAccess = new AlertsAccess();

export async function createAlert(
  newAlert: CreateAlertRequest,
  userId: string
): Promise<AlertItem> {
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

  logger.info("Creating todo", alertItem);
  await alertsAccess.createTodo(alertItem);
  logger.info("Todo was created");
  return alertItem;
}
