import crypto from "crypto";

interface FawaterakWebhookData {
  hashKey: string;
  invoice_id: number | string;
  invoice_key: string;
   transaction_id: number | string;
  transaction_key: string;
  payment_method: string;
}

export const verifyWebhookHash = (
  data: FawaterakWebhookData
): boolean => {
  const vendorKey = process.env.FAWATERAK_VENDOR_KEY;

  if (!vendorKey) {
    throw new Error("FAWATERAK_VENDOR_KEY is missing");
  }

  const stringToSign =
    `TransactionId=${data.transaction_id}` +
    `&TransactionKey=${data.transaction_key}` +
    `&PaymentMethod=${data.payment_method}`;

  const generatedHash = crypto
    .createHmac("sha256", vendorKey)
    .update(stringToSign)
    .digest("hex");

  const receivedHash = data.hashKey;

  if (!/^[a-f0-9]{64}$/i.test(receivedHash)) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(generatedHash, "hex"),
    Buffer.from(receivedHash, "hex")
  );
};