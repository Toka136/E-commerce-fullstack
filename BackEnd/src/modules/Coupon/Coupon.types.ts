import { couponType } from "../../generated/prisma/enums";

export interface addCouponParams {
  code: string;
  type?: couponType;          
  discount: number;          
  minAmount?: number;   
  maxUses?: number;     
  maxAmount?: number;        
  startDate: Date | string;
  endDate: Date | string;
  maxUsesPerUser?: number;    
  isActive?: boolean;         
}
export interface editCouponParams {
  type?: couponType;          
  discount: number;          
  minAmount?: number;        
  maxAmount?: number;        
  startDate: Date | string;
  endDate: Date | string;
  maxUsesPerUser?: number;    
  isActive?: boolean;  
  maxUses?: number;           
}