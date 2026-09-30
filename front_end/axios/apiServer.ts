import { BaseUrl } from "@/constant/api";
import { useAuthStore } from "@/features/Auth/store/auth-store";
import axios from "axios";
import { cookies } from "next/headers";

export const apiServer = axios.create({
  baseURL: `${BaseUrl}`,
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
// axios/server.ts
apiServer.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();

  

  config.headers["Cookie"] = cookieStore.toString();

  const accessToken = cookieStore.get("accessToken")?.value;
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});



// Fallback ONLY — middleware should prevent this from firing in practice.
// Can't persist cookies here, so this just rescues the current render.
apiServer.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) return Promise.reject(error);

    try {
      const refreshRes = await axios.post(
        `${BaseUrl}auth/refreshToken`,
        {},
        {
          headers: { Cookie: cookieStore.toString() },
          // axios needs this to expose set-cookie in node
          maxRedirects: 0,
        }
      );

      const setCookieHeader = refreshRes.headers["set-cookie"]; // string[] in node
      const newaccessToken = extractCookieValue(setCookieHeader, "accessToken");
      if (!newaccessToken) return Promise.reject(error);

      // reuse in-memory for THIS request only — browser cookie is untouched
      original.headers.Cookie = cookieStore
        .toString()
        .replace(/accessToken=[^;]+/, `accessToken=${newaccessToken}`);

      return apiServer(original);
    } catch (refreshErr) {

      return Promise.reject(refreshErr);
    }
  }
);

function extractCookieValue(setCookie: string[] | undefined, name: string) {
  if (!setCookie) return null;
  for (const c of setCookie) {
    const match = c.match(new RegExp(`${name}=([^;]+)`));
    if (match) return match[1];
  }
  return null;
}