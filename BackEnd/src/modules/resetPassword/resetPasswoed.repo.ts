import {prisma} from "../../config/prisma"
export const createResetPassword=async( userId:string,tokenHash:string)=>{
   return  await prisma.resetPassword.create({
     data:{userId,tokenHash,expiresAt:new Date(Date.now() + 15 * 60 * 1000)}
   })
}
export const findVerificationToken = async (
  tokenHash: string
) => {
  return await prisma.resetPassword.findUnique({
    where: { tokenHash },
  })
};
export const deletePasswordResetToken = async (
  tokenId: string
) => {
  return await prisma.resetPassword.delete({
    where: { id: tokenId },
  })
};