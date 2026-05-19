"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginBackgroundVideo from "@/components/auth/LoginBackgroundVideo";
import PasswordInput from "@/components/auth/PasswordInput";
import { validateRegister } from "@/lib/auth/validateRegister";
import styles from "@/styles/login.module.scss";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validateRegister({ name, email, password, confirmPassword });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setSuccess(true);
    setTimeout(() => {
      router.push("/login?registered=1");
    }, 1200);
  };

  return (
    <div className={styles.page}>
      <LoginBackgroundVideo />

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cordelio.png" alt="Cordelio" className={styles.logoImg} />
          <div>
            <h1 className={styles.title}>Kayıt Ol</h1>
            <p className={styles.subtitle}>Yeni hesap oluşturun</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          {success && (
            <div className={styles.success}>
              Bilgiler geçerli. Giriş sayfasına yönlendiriliyorsunuz…
            </div>
          )}

          <div>
            <label className={styles.label} htmlFor="name">
              Ad soyad
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className={styles.label} htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className={styles.label} htmlFor="password">
              Şifre
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className={styles.label} htmlFor="confirmPassword">
              Şifre tekrar
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || success}>
            {loading ? "Kontrol ediliyor…" : "Kayıt Ol"}
          </button>
        </form>

        <p className={styles.footerText}>
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className={styles.footerLink}>
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
