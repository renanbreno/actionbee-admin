export interface UpdateOrderStatusDTO {
  status: string;
  trackingCode?: string;
  cancellationReason?: string;
}
