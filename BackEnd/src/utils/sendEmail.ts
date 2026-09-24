import transporter from "../config/email"

export const SendEmailS=async(email:string,subject:string,html:string)=>{
    try {
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:subject,
            html:html
        })
        console.log("Email sent")
    } catch (error) {
        console.log(error)
    }
}