

export interface CartDrawerProps {
 
  onCheckout?: () => void;
  shippingEstimate?: number;
}
export interface cartStore{
 
  isOpen:boolean,
  onOpen:()=>void,
  onClose:()=>void,
 
}
export interface cartProduct {
  _id: string;
  title: string;
  price: number;
  coverImage: string;
  stock: number;
}

export interface CartItem {
  product: cartProduct;
  quantity: number;
  priceAtPurchase: number;
}
export interface UICartItem{
  id:string,
  title:string,
  priceAtPurchase:number,
  quantity:number,
  coverImage:string
}

export interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  __v: number;
}

export interface CartResponse {
  status: string;
  message: string;
  data: CartData;
}