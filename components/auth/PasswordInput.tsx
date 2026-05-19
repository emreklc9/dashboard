"use client";

import { useState } from "react";
import loginStyles from "@/styles/login.module.scss";
import profileStyles from "@/styles/profile.module.scss";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  variant?: "login" | "profile";
};

type StyleSet = {
  wrap: string;
  input: string;
  toggle: string;
};

const STYLE_MAP: Record<"login" | "profile", StyleSet> = {
  login: {
    wrap: loginStyles.passwordWrap,
    input: loginStyles.inputPassword,
    toggle: loginStyles.passwordToggle,
  },
  profile: {
    wrap: profileStyles.passwordWrap,
    input: profileStyles.inputPassword,
    toggle: profileStyles.passwordToggle,
  },
};

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
    );
  }
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} width={18} height={18}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export default function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required,
  placeholder,
  variant = "login",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const styles = STYLE_MAP[variant];

  return (
    <div className={styles.wrap}>
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
        tabIndex={-1}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}
