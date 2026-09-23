import crypto from "crypto";
import { createEmailVerification, findVerificationToken } from "./emailVerification.repo";
import transporter from "../../config/email"
import { verifyUser } from "../profile/profile.repo";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";

export const createEmailVerificationS=async(userId:string)=>{
    const verificationToken=crypto.randomBytes(32).toString('hex')
    const hash=crypto.createHash('sha256').update(verificationToken).digest('hex')
   await  createEmailVerification(userId,hash)
    return verificationToken
}

export const SendVerificationEmailS=async(email:string,subject:string,html:string)=>{
    try {
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:subject,
            html:html
        })
        console.log("Email sent")
    } catch (error) {
        console.log(error)
    }
}
export const verifyEmailS = async (rawToken: string) => {

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const verificationToken =
    await findVerificationToken(tokenHash);

  if (!verificationToken) {
    throw new appError(
      "Invalid token",
      400,
      responseStatus.FAILED
    );
  }

  if (verificationToken.expiresAt.getTime() < Date.now()) {
    throw new appError(
      "Token Expired",
      400,
      responseStatus.FAILED
    );
  }

  await verifyUser(
    verificationToken.userId.toString()
  );
};