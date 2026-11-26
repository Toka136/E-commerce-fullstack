import { Router } from "express";
import { fawaterakFailedWebhookController, fawaterakPaidWebhookController } from "./webhooks.controller";

const router = Router();

router.post("/paid", fawaterakPaidWebhookController);
router.post("/failed", fawaterakFailedWebhookController);

export default router;