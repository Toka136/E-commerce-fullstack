import { Prisma } from "../../generated/prisma/client";
import { paymentStatus } from "../../generated/prisma/enums";

export interface paymentI {
  orderId: string;
  amount: Prisma.Decimal;
  provider?: string;
  paymentMethod: number;
  intentKey?: string;
  paymentUrl?: string;
  referenceNumber?: string;
  systemReference?: string;
  isoQr?: string;
  expireDate?: string;
  status?: paymentStatus;
}

