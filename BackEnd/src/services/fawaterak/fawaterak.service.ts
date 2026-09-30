import axios from "axios";

export const getFawaterakAccessToken = async () => {
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

  return response.data.access_token;
};