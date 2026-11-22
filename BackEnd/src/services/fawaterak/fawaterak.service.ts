import axios from "axios";
import redis from "../../config/redis";
import { FawaterakTransactionPayload, FawaterakTransactionResponse } from "../../Types/fawaterakTypes";

const TOKEN_CACHE_KEY = "fawaterak:access_token";

export const getFawaterakAccessToken = async () => {
  // 1. Check Redis first
  const cachedToken = await redis.get(TOKEN_CACHE_KEY);

  if (cachedToken) {
    return cachedToken;
  }

  // 2. Request new token
  const response = await axios.post(
    process.env.FAWATERAK_TOKEN_URL!,
    {
      grant_type: "client_credentials",
      client_id: process.env.FAWATERAK_CLIENT_ID,
      client_secret: process.env.FAWATERAK_CLIENT_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("expires_in:", response.data.expires_in);

  const { access_token, expires_in } = response.data;

  // 3. Cache token in Redis
  // Keep a 60-second safety margin before expiration
  const ttl = Math.max(expires_in - 60, 1);

  await redis.set(TOKEN_CACHE_KEY, access_token, {
    ex: ttl,
  });

  return access_token;
};
export const getPaymentmethods=async()=>{
  const token=await getFawaterakAccessToken();
  const response=await axios.get(`${process.env.FAWATERAK_BASE_URL}getTrPaymentmethods`,{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
export const createFawaterakTransaction = async (payload: FawaterakTransactionPayload): Promise<FawaterakTransactionResponse> => {
  const token = await getFawaterakAccessToken();

  const response = await axios.post(
    `${process.env.FAWATERAK_BASE_URL}createTransaction`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(
  "Fawaterak Response:",
  JSON.stringify(response.data, null, 2)
);

  return response.data;
};
