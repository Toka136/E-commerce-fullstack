import multer from "multer"
import { Request } from "express" 
import fs from "fs"
import path from "path"

const storage=multer.diskStorage({
    destination:(req:Request,file:Express.Multer.File,cb)=>{
        const uploadPath = path.join(__dirname, '../Uploads')
        console.log("uploadPath",uploadPath)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename:(req,file,cb)=>{
        cb(null,`user-${Date.now()}-${file.originalname}`)
    }
})
const fileFilter=(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }else{
        cb(new Error('Not an image'))
    }
}
export const imageUpload=multer({storage, fileFilter})