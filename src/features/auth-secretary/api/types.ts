export interface SecretaryLoginPayload {
  email: string;
  password: string;
}

export interface SecretaryUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface SecretaryLoginResponseData {
  user?: SecretaryUser;
  access_token: string;
}

export interface SecretaryForgotPasswordPayload {
  email: string;
}

export interface SecretaryResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}
