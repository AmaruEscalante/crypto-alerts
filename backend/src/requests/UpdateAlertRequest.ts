export interface UpdateAlertRequest {
  cryptoId?: string;
  priceThreshold?: number;
  errorMargin?: number;
  isActive: boolean;
}
