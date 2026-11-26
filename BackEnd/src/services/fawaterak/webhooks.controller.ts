import { Request, Response, NextFunction } from "express";
import { verifyWebhookHash } from "./utils/verifyWebhookHash";
import { failedWebHookS, paidWebHookS } from "./fawaterak.service";

export const fawaterakPaidWebhookController = async (
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

    await paidWebHookS(
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
export const fawaterakFailedWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
        const data = req.body;

    console.log("Failed Webhook Body:", req.body);

    const isValid = verifyWebhookHash(data);

    if (!isValid) {
       console.log("not valid")
      return res.status(401).json({
        message: "Invalid webhook signature",
      });
    }

    if (
   
    data.invoice_status !== "not_paid"
    ) {
       console.log("not match")
    return res.status(200).json({
        received: true,
    });
    }

    const payload = JSON.parse(data.pay_load);

    await failedWebHookS(
    payload.order_id,
    data.transaction_key,
    Number(data.amount)
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