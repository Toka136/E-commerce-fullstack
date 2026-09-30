import emailVerificationModal from "./emailVerification.modal"

export const createEmailVerification=async( userId:string,tokenHash:string)=>{
   return  await emailVerificationModal.create({userId,tokenHash,expiresAt:new Date(Date.now() + 15 * 60 * 1000)})
}
export const findVerificationToken = async (
  tokenHash: string
) => {
  return await emailVerificationModal.findOne({
    tokenHash,
  });
};