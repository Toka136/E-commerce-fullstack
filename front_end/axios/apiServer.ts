import { useAuthStore } from "@/features/Auth/store/auth-store";
import axios from "axios";
import { cookies } from "next/headers";

export const apiServer = axios.create({
  baseURL: "http://localhost:4000/api/",
  withCredentials: true,
});
apiServer.interceptors.request.use( async (config) => {
  const cookieStore = await cookies();
 const cookieHeader=cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
  if (cookieHeader) {
    config.headers.Cookie = cookieHeader;
  }
  return config;
})
// apiServer.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       console.log("refresh");
//       originalRequest._retry = true;
//       try{
//       const res = await axios.post("http://localhost:4000/api/auth/refreshToken", {
        
//       },{
//         withCredentials: true,
//       });
//      console.log("refresh",res.data);
//       return apiServer(originalRequest);
//     }
//     catch(refreshError){
//        useAuthStore.getState().logout();
//         // window.location.href = "/login";
//        return Promise.reject(refreshError);
      
//     }
//     }
//     return Promise.reject(error);
//   }
// );