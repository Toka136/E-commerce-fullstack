import axios from "axios";
import { registerInputT } from "../types/registerType";

export const Register=async(data:registerInputT)=>{
    
    const formData=new FormData()
    formData.append("userName",data.userName)
    formData.append("email",data.email)
    formData.append("password",data.password)
    data.image&&formData.append("image",data.image)
     console.log("dataregform",formData)
    const res =await axios.post("http://localhost:4000/api/auth/register",{
        body:formData,
        credentials:"include"
    })
     
   
    return res.data;
}
