import { UserData } from "./Auth.types";
import User from "./user.model";
export const R_register=async(newUser:UserData)=>{
    const user=new User(newUser)
     await user.save()
     console.log("user",user)
     return user

}

export const findUser=async(email:string)=>{
    return await User.findOne({email})
}
