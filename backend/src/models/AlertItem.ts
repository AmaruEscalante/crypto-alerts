export interface AlertItem {
  userId: string;
  alertId: string;
  createdAt: string;
  cryptoId: string;
  priceThreshold: number;
  errorMargin: number;
  isActive: boolean;
}
