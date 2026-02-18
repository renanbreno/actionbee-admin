import { apiFetch } from "../api-client";

export interface AddressLookupResponse {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export async function lookupAddressByZipCode(
  zipCode: string
): Promise<AddressLookupResponse> {
  const sanitizedZipCode = zipCode.replace(/\D/g, "");
  if (sanitizedZipCode.length !== 8) {
    throw new Error("CEP deve conter 8 dígitos");
  }
  return apiFetch<AddressLookupResponse>(
    `/address/zipcode/${sanitizedZipCode}`
  );
}
