export type authMeResponse={
    "status": string,
    "message": string,
    "data": {
        "id": string,
        "email": string,
        "role": string,
        "iat": number,
        "exp": number
    }
}
   