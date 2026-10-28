export type CartT={
    data:{
        userId:string,
        items:cartItemT[]
    },
    cartCount:number,
    setCart:(userId:string,
        items:cartItemT[],cartCount:number)=>void,
    addProductTocart:(product:cartItemT)=>void,
    removeProductFromCart:(product:string)=>void,
    clearCart:()=>void
}
export type cartItemT={
    product: productT,
    quantity: number,     
}
export type productT={
    _id: string,
    title: string,
    price: number,
    coverImage: string
}