import resetPasswordModal from "./resetPassword.modal";

export const createResetPassword=async( userId:string,tokenHash:string)=>{
   return  await resetPasswordModal.create({userId,tokenHash,expiresAt:new Date(Date.now() + 15 * 60 * 1000)})
}
export const findVerificationToken = async (
  tokenHash: string
) => {
  return await resetPasswordModal.findOne({
    tokenHash,
  });
};
export const deletePasswordResetToken = async (
  tokenId: string
) => {
  return await resetPasswordModal.deleteOne({
    _id: tokenId,
  });
};