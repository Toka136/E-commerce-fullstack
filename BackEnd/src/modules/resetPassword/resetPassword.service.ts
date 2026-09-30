import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { SendEmailS } from "../../utils/sendEmail";
import { findUser } from "../Auth/Auth.repo";
import { updatePassword } from "../profile/profile.repo";
import { createResetPassword, deletePasswordResetToken, findVerificationToken } from "./resetPasswoed.repo"
import crypto from "crypto";
import bcrypt from "bcrypt"
export const createResetPasswordToken=async(userId:string)=>{
 
    const verificationToken=crypto.randomBytes(32).toString('hex')
    const hash=crypto.createHash('sha256').update(verificationToken).digest('hex')
   await  createResetPassword(userId,hash)
    return verificationToken
}
export const sendResetPasswordLinkS=async(email:string)=>{
  const user=await findUser(email)
  if(!user){
      throw new appError("User Not Found",400,responseStatus.FAILED)
  }
  const token=await createResetPasswordToken(user._id.toString())
   const verificationUrl =
  `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
 const emailTemp=`<p>Please click the link below to reset your password:</p>
  <a href="${verificationUrl}">${verificationUrl}</a>`
  await SendEmailS(email,"Reset Password",emailTemp)
  return token
}
export const resetPasswordS = async (rawToken: string,newPassword:string) => {

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
    const salt = await bcrypt.genSalt(10);
     const newPass = await bcrypt.hash(newPassword, salt);
  await updatePassword(
    verificationToken.userId.toString(),
    newPass
  );
  await deletePasswordResetToken(verificationToken._id.toString());
};