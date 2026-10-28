import { authFetch } from "@/utils/authFetch";

export const addToCart=async(productId:string)=>{
    console.log("productId",productId)
    const res=await authFetch(`http://localhost:4000/api/cart/addProductIntoCart/`,{
         headers: {
    "Content-Type": "application/json",
  },
        body:JSON.stringify({productId}),
        method:"POST",
        credentials:"include"
    })
    const result = await res.json();
    if(!res.ok)
      throw new Error(result.message);
    return result

}