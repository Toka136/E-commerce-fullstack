export type AuthStoreT={
    isLoggedIn:boolean,
    userData:{
        userName:string,
        userAvatar?:string,
        userRole?:string,
        _id?:string
    }
    login:()=>void,
    logout:()=>void,
    setUserData:(name:string,avatar?:string,role?:string,_id?:string)=>void,
}