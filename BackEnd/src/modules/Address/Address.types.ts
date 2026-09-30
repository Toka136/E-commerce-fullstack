export interface address{
    title:string,
    city:string,
    addressLine1:string,
    addressLine2?:string,
    state:string,
    country:string,
    postalCode:string,
    mobile:string,
    isDefault?:boolean
}
export interface addAddressParams
{
    userId:string,
    address:address
}
export interface updateAddressParams
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
    updatedAt:Date,
    
}