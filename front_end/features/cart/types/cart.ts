

export interface CartDrawerProps {
 
  onCheckout?: () => void;
  shippingEstimate?: number;
}
export interface cartStore{
 
  isOpen:boolean,
  onOpen:()=>void,
  onClose:()=>void,
  count:number,
  setCount:(count:number)=>void
 
}
export interface cartBook {
  id: string;
  title: string;
  price: number;
  coverImage: string;
  stock: number;
}

export interface CartItem {
  book: cartBook;
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
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
}

export interface CartResponse {
  status: string;
  message: string;
  data: CartData;
}