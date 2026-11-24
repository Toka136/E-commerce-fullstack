import { Router } from "express";
import { fawaterakWebhookController } from "./webhooks.controller";

const router = Router();

router.post("/fawaterak_json", fawaterakWebhookController);

export default router;