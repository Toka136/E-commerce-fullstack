import { useAuthStore } from "@/features/Auth/store/auth-store";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api/",
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("refresh");
      originalRequest._retry = true;
      try{
      const res = await axios.post("http://localhost:4000/api/auth/refreshToken", {
        
      },{
        withCredentials: true,
      });
     console.log("refresh",res.data);
      return api(originalRequest);
    }
    catch(refreshError){
       useAuthStore.getState().logout();
        window.location.href = "/login";
       return Promise.reject(refreshError);
      
    }
    }
    return Promise.reject(error);
  }
);