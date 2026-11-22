import "dotenv/config";
import redis from "../../../config/redis";
import { getFawaterakAccessToken, getPaymentmethods } from "../fawaterak.service";


const testToken = async () => {
  const methods = await getPaymentmethods();
  console.log("methods:", methods);
};

testToken();