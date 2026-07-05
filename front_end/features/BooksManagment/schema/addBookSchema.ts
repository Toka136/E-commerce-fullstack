import * as Yup from "yup";
export const addBookSchema = Yup.object({
    title:Yup.string().required(),
    author:Yup.string().required(),
    genre:Yup.string().required(),
    price:Yup.number().required(),
    description:Yup.string().required(),
    coverImage:Yup.mixed().required(),
    stock:Yup.number().required(),
})