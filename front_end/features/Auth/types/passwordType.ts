export interface forgotPasswordInputT {
  email: string;
}

export interface resetPasswordInputT {
  token: string;
  password: string;
}

export interface passwordResponse {
  message: string;
}