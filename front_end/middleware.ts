import { NextRequest, NextResponse } from "next/server";
import { BaseUrl } from "./constant/api";

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString()
    );

    if (!payload.exp) return true;

    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function mergeCookies(
  existingCookieHeader: string,
  setCookieHeaders: string[]
) {
  const cookieMap = new Map<string, string>();

  existingCookieHeader.split(";").forEach((pair) => {
    const [key, ...rest] = pair.trim().split("=");

    if (key) {
      cookieMap.set(key, rest.join("="));
    }
  });

  setCookieHeaders.forEach((setCookie) => {
    const [pair] = setCookie.split(";");
    const [key, ...rest] = pair.trim().split("=");

    if (key) {
      cookieMap.set(key, rest.join("="));
    }
  });

  return Array.from(cookieMap.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

export default async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // No access token
  if (!accessToken) {
    return NextResponse.next();
  }

  // Access token still valid
  if (!isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // Access token expired but no refresh token
  if (!refreshToken) {
    return NextResponse.next();
  }

  console.log("Access token expired -> refreshing");

  try {
    const refreshResponse = await fetch(
      `${BaseUrl}auth/refreshToken`,
      {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      }
    );

    console.log(
      "Refresh status:",
      refreshResponse.status
    );

    // Refresh failed
    if (!refreshResponse.ok) {
      console.log("Refresh failed");
      return NextResponse.next();
    }

    const setCookies =
      refreshResponse.headers.getSetCookie();

    console.log("Refresh cookies:", setCookies);

    if (!setCookies.length) {
      console.log(
        "Refresh succeeded but no Set-Cookie returned"
      );

      return NextResponse.next();
    }

    /*
     * Merge old cookies with refreshed cookies
     * for the current request.
     */
    const requestHeaders = new Headers(
      request.headers
    );

    const newCookieHeader = mergeCookies(
      request.headers.get("cookie") ?? "",
      setCookies
    );

    requestHeaders.set(
      "cookie",
      newCookieHeader
    );

    /*
     * Continue request using the new accessToken.
     */
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    /*
     * Persist the refreshed cookies
     * in the browser.
     */
    for (const cookie of setCookies) {
      response.headers.append(
        "Set-Cookie",
        cookie
      );
    }

    return response;
  } catch (error) {
    console.error(
      "Refresh token error:",
      error
    );

    // Don't block the page.
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Run middleware on application routes,
     * but skip Next internals and static files.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};