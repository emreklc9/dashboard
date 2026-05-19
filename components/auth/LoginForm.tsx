"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginBackgroundVideo from "@/components/auth/LoginBackgroundVideo";
import PasswordInput from "@/components/auth/PasswordInput";
import styles from "@/styles/login.module.scss";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("cordelio@dev.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered") === "1";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Giriş başarısız.");
        return;
      }

      const from = searchParams.get("from");
      const target =
        from &&
        from.startsWith("/") &&
        !from.startsWith("/login") &&
        !from.startsWith("/register")
          ? from
          : "/dashboard";
      window.location.replace(target);
      return;
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <LoginBackgroundVideo />

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/cordelio.png" alt="Cordelio" className={styles.logoImg} />
          <div>
            <h1 className={styles.title}>Cordelio Dashboard</h1>
            <p className={styles.subtitle}>Hesabınıza giriş yapın</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {registered && (
            <div className={styles.success}>
              Kayıt formu doğrulandı. Demo giriş: cordelio@dev.com / test123
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}

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
              required
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
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className={styles.hint}>Demo: cordelio@dev.com</p>

        <p className={styles.footerText}>
          Hesabınız yok mu?{" "}
          <Link href="/register" className={styles.footerLink}>
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  );
}
