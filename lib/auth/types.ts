export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type SessionPayload = AuthUser & {
  iat: number;
  exp: number;
};
