import { useMutation } from "@tanstack/react-query";
import { lookupAddressByZipCode, type AddressLookupResponse } from "@/shared/infrastructure/api/address/address-api.client";

export function useAddressLookup() {
  return useMutation<AddressLookupResponse, Error, string>({
    mutationFn: (zipCode: string) => lookupAddressByZipCode(zipCode),
  });
}
