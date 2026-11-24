import { Request, Response, NextFunction } from "express";
import { verifyWebhookHash } from "./utils/verifyWebhookHash";
import { webHookS } from "./fawaterak.service";

export const fawaterakWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = req.body;

    const isValid = verifyWebhookHash(data);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid webhook signature",
      });
    }

    if (
    data.status !== "paid" ||
    data.invoice_status !== "paid"
    ) {
    return res.status(200).json({
        received: true,
    });
    }

    const payload = JSON.parse(data.pay_load);

    await webHookS(
    payload.order_id,
    data.transaction_key,
    Number(data.paidAmount)
    );

    return res.status(200).json({
    received: true,
    });
   

  } catch (error) {
    console.error("Webhook Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};