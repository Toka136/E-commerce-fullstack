export interface userProfileBase {
  userName: string;
 
  phoneNumber?: string;
}
export interface updateProfile extends userProfileBase {
  image?: File | null;
}
export interface userProfile extends userProfileBase {
  id: string;
   role: string;
   email: string;
   image?: string;
   ordersCount: number;
   wishListItemsCount: number;
 
}
export interface GetProfileResponse{
      status: string;
  message: string;
  data: userProfile;
}
