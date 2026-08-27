import { apiServer } from "@/axios/apiServer"
import { AddressListResponse } from "../types/address"
import { AxiosError } from "axios"

export const getAddressesApi=async():Promise<AddressListResponse>=>{
    try{
    const res=await apiServer.get("address/getAddresses")
    return res.data
    }
    catch(err)
    {
        const error=err as AxiosError
          if (err instanceof AxiosError) {
          console.log("STATUS:", err.response?.status);
          console.log("DATA:", err.response?.data);
          console.log("MESSAGE:", err.response?.data?.message);
        }
  
        throw err;
    }
}