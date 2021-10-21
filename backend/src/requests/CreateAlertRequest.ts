export interface CreateAlertRequest {
  cryptoId: string;
  priceThreshold: number;
  errorMargin: number;
  isActive?: boolean;
}
