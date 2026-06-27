export type AuthStoreT={
    isLoggedIn:boolean,
    userData:{
        userName:string,
        userAvatar?:string,
        userRole?:string
    }
    login:()=>void,
    logout:()=>void,
    setUserData:(name:string,avatar?:string,role?:string)=>void,
}