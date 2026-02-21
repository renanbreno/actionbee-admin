import { StoreSettings } from "../entities/store-settings";

export interface UpdateStoreSettingsParams {
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

export interface StoreSettingsRepository {
  get(): Promise<StoreSettings | null>;
  create(params: UpdateStoreSettingsParams): Promise<StoreSettings>;
  update(params: UpdateStoreSettingsParams): Promise<StoreSettings>;
}
