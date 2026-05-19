import type { AuthUser } from "./types";

/** Fake backend kullanıcı veritabanı */
const FAKE_USERS: Array<AuthUser & { password: string }> = [
  {
    id: "usr-1",
    email: "cordelio@dev.com",
    password: "test123",
    name: "Cordelio Admin",
    role: "admin",
  },
];

export function authenticateUser(
  email: string,
  password: string
): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const user = FAKE_USERS.find(
    (u) => u.email.toLowerCase() === normalized && u.password === password
  );
  if (!user) return null;
  const { password: _, ...authUser } = user;
  return authUser;
}
