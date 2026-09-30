export interface Category{
    _id: string,
    name: string,
    description: string,
    slug: string,
}
export interface GetCategoriesResponse{
    data:Category[],
    status:string,
    message:string
}
export interface AddCategoryReq{
   name:string,
   description?:string
}