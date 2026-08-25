export interface userProfileBase {
  userName: string;
  email: string;
 
  phoneNumber?: string;
}
export interface updateProfile extends userProfileBase {
  image?: File | null;
}
export interface userProfile extends userProfileBase {
  _id: string;
   role: string;
   image?: string;
 
}
export interface GetProfileResponse{
      status: string;
  message: string;
  data: userProfile;
}