import express, { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import AuthRoutes from "./modules/Auth/Auth.routes"
import BookRoutes from "./modules/Books/book.routes"
import CartRoutes from "./modules/Cart/Cart.routes"
import { responseStatus } from "./utils/responseStatus"
import appError from "./utils/errorClass"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from "path"
const app = express()
app.use(cookieParser())
dotenv.config()
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
))
app.use(express.json())
mongoose.connect(process.env.MONGO_URL as string).then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log(err)
})
app.use("/api/auth",AuthRoutes)
app.use("/api/books",BookRoutes)
app.use("/api/cart",CartRoutes)
app.use("/api/Uploads", express.static(path.join(__dirname, "Uploads")));
app.use((req, res) => {
  
  res.status(404).json({
    statusText: responseStatus.FAILED,
    message: "This resource is not availabe",
  });
});
app.use((err:appError,req:Request,res:Response,next:NextFunction)=>{
    res.status(err.statusCode||500).json({
        status:err.statusText||responseStatus.FAILED,
        statusCode:err.statusCode||500,
        message:err.message
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})