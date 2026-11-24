import crypto from "crypto";

interface FawaterakWebhookData {
  hashKey: string;
  invoice_id: number | string;
  invoice_key: string;
  payment_method: string;
}

export const verifyWebhookHash = (
  data: FawaterakWebhookData
): boolean => {
  const vendorKey = process.env.FAWATERAK_VENDOR_KEY;

  if (!vendorKey) {
    throw new Error("FAWATERAK_VENDOR_KEY is missing");
  }

  const queryParam =
    `InvoiceId=${data.invoice_id}` +
    `&InvoiceKey=${data.invoice_key}` +
    `&PaymentMethod=${data.payment_method}`;

  const generatedHash = crypto
    .createHmac("sha256", vendorKey)
    .update(queryParam)
    .digest("hex");

  const receivedHash = data.hashKey;

  if (
    !/^[a-f0-9]{64}$/i.test(receivedHash) ||
    !/^[a-f0-9]{64}$/i.test(generatedHash)
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(generatedHash, "hex"),
    Buffer.from(receivedHash, "hex")
  );
};