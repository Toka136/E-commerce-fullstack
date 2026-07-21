import { ObjectId } from "mongodb"

export interface orderItemI{
     book:ObjectId,
     quantity:Number,
    priceAtPurchase:Number,
    titleAtPurchase:String,
    imageAtPurchase:String
}


export interface orderI {
  userId: ObjectId;
  items: orderItemI[];
  totalPrice: number;
  paymentMethod: 'cash' | 'online';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}