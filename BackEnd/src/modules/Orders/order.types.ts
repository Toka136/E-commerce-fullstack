import { ObjectId } from "mongodb"

export interface orderItemI{
     book:ObjectId,
     quantity:Number,
    priceAtPurchase:Number,
    titleAtPurchase:String,
    imageAtPurchase:String
}

export interface shippingAddress{
    addressLine1:string,
    addressLine2?:string,
    city:string,
    state:string,
    country:string,
    postalCode:string,
    mobile:string
}
export interface orderI {
  userId: ObjectId;
  items: orderItemI[];
  totalPrice: number;
  paymentMethod: 'cash' | 'online';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: shippingAddress;
  createdAt?: Date;
  updatedAt?: Date;
}
