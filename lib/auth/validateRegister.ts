export type RegisterFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function validateRegister(fields: RegisterFields): string | null {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const password = fields.password;
  const confirmPassword = fields.confirmPassword;

  if (!name) return "Ad soyad boş bırakılamaz.";
  if (!email) return "E-posta boş bırakılamaz.";
  if (!password) return "Şifre boş bırakılamaz.";
  if (!confirmPassword) return "Şifre tekrarı boş bırakılamaz.";

  if (!email.includes("@") || !email.includes(".")) {
    return "Geçerli bir e-posta adresi girin.";
  }

  if (password.length < 6) {
    return "Şifre en az 6 karakter olmalı.";
  }

  if (password !== confirmPassword) {
    return "Şifreler eşleşmiyor.";
  }

  return null;
}
