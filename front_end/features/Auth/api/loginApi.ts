import { loginInputT } from "../types/loginType";

export const Login = async (data: loginInputT) => {
    console.log("data send to api", data);

    const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password
        }),
        credentials: "include"
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result?.message || "Login failed due to server error");
    }

    return result;
};