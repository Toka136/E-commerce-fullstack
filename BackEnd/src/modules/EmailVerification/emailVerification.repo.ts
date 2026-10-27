import { prisma } from "../../config/prisma";

export const createEmailVerification=async( userId:string,tokenHash:string)=>{
   return  await prisma.emailVerification.create({
       data:{
      userId,
      tokenHash,
      expiresAt:new Date(Date.now() + 15 * 60 * 1000)
    }
   })
}
export const findVerificationToken = async (
  tokenHash: string
) => {
  return await prisma.emailVerification.findUnique({
    where: { tokenHash },
  });
};