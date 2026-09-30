export interface Address {
  _id: string;
  userId: string;
  title: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  mobile: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressListResponse {
  status: string;
  message: string;
  data: Address[];
}
export interface CreateAddressParams {
  title: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  mobile: string;
}

export interface editAddressParams
{
    addressId:string,
    title?:string,
    city?:string,
    addressLine1?:string,
    addressLine2?:string,
    state?:string,
    country?:string,
    postalCode?:string,
    mobile?:string,    
}