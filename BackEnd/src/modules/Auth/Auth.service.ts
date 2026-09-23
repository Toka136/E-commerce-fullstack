import appError from "../../utils/errorClass"
import jwt from "jsonwebtoken"
import { responseStatus } from "../../utils/responseStatus"
import { TokenCreation } from "../../utils/tokenCreation"
import { findUser, R_register } from "./Auth.repo"
import { loginBody, UserData } from "./Auth.types"
import bcrypt from "bcrypt"
import { uploadToCloudinary } from "../../utils/uploadToCloudinary"
import cloudinary from "../../config/cloudinaryconfig"
import { createEmailVerificationS, SendVerificationEmailS } from "../emailVerification/emailVerification.service"


export const S_register = async (
  user: UserData,
  file?: Express.Multer.File
) => {
  const checkUserE = await findUser(user.email);

  if (checkUserE) {
    throw new appError(
      "User Already Exists",
      400,
      responseStatus.FAILED
    );
  }

  const salt = await bcrypt.genSalt(10);
  const newPass = await bcrypt.hash(user.password, salt);
  user.password = newPass;

  let uploadedImage;

  try {
    if (file) {
      uploadedImage = await uploadToCloudinary(
        file.buffer,
        "users"
      );

      user.image = uploadedImage.secure_url;
      user.imagePublicId = uploadedImage.public_id;
    }

   

  

  } catch (error) {

    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(
        uploadedImage.public_id
      );
    }

    throw error;
  }
   const newUser = await R_register(user);
  const rawToken= await createEmailVerificationS(newUser._id.toString())
  const verificationUrl =
  `${process.env.FRONTEND_URL}verify-email?token=${rawToken}`;
  const emailTemp=`<p>Please click the link below to verify your email address:</p>
  <a href="${verificationUrl}">${verificationUrl}</a>`
  await SendVerificationEmailS(user.email,"Verify Your Email",emailTemp)

    return {
      newUser,
    
    };
};
export const S_login=async(user:loginBody)=>{
    const existUser=await findUser(user.email)
    if(!existUser){
        throw new appError("Invalid Credentials",400,responseStatus.FAILED)
    }
    if(existUser.verified===false){
        throw new appError("Email Not Verified",400,responseStatus.FAILED)
    }
    const checkPass=await bcrypt.compare(user.password,existUser.password)
    if(!checkPass){
        throw new appError("Invalid Credentials",400,responseStatus.FAILED)
    }
    const accessToken=TokenCreation({id:existUser._id,email:existUser.email,role:existUser.role},"60m")
    const refreshToken=TokenCreation({id:existUser._id,email:existUser.email,role:existUser.role},"7d")
    const returnedUser={newUser:existUser,accessToken,refreshToken}

    return returnedUser
}
export const S_refreshToken=async(token:string)=>{
    if(!token){
        throw new appError("Refresh Token Not Found",400,responseStatus.FAILED)
    }
      const decode=await jwt.verify(token,process.env.JWT_SECRET_KEY as string)
      if(typeof decode!=="object" || !decode){
          throw new appError("Invalid Token",400,responseStatus.FAILED)
      }
      const user=await findUser(decode.email)
      if(!user){
          throw new appError("User Not Found",400,responseStatus.FAILED)
      }
      const accessToken=TokenCreation({id:user._id ,email:user.email,role:user.role},"60m")
      const refreshToken=TokenCreation({id:user._id,email:user.email,role:user.role},"7d")
      const returnedUser={newUser:user,accessToken,refreshToken}
    return returnedUser
    
   
}