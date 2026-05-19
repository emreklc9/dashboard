/** Oturum süresi: 3 saat */
export const SESSION_MAX_AGE_SEC = 3 * 60 * 60;

export const SESSION_COOKIE_NAME = "cordelio_session";

export const JWT_SECRET =
  process.env.JWT_SECRET ?? "cordelio-dashboard-dev-secret-min-32-chars!!";
