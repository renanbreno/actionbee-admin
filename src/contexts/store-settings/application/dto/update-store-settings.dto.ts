export interface UpdateStoreSettingsDto {
  freeShippingEnabled?: boolean;
  freeShippingMinValue?: number;
  motoboyDeliveryEnabled?: boolean;
  motoboyDeliveryPrice?: number;
  motoboyDeliveryTimeDays?: number;
  zipCode?: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  name?: string;
  document?: string;
  phone?: string;
  email?: string;
  paymentMinInstallmentValue?: number;
  paymentInterestFreeThreshold?: number;
  paymentInterestFreeInstallmentsBelow?: number;
  paymentInterestFreeInstallmentsAbove?: number;
  paymentMaxInstallmentsLimit?: number;
  maxGiftsPerOrder?: number;
}
