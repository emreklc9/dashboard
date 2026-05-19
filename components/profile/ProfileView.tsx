"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useProfile } from "@/context/ProfileContext";
import { JOB_ROLE_OPTIONS, TIMEZONE_OPTIONS } from "@/lib/profile/constants";
import type { JobRole, TaskPriority, TaskStatus } from "@/lib/profile/types";
import styles from "@/styles/profile.module.scss";

const DEFAULT_AVATAR = "/image/cordelio-harf.png";

const PRIORITY_LABEL: Record<TaskPriority, { tr: string; en: string }> = {
  high: { tr: "Yüksek", en: "High" },
  medium: { tr: "Orta", en: "Medium" },
  low: { tr: "Düşük", en: "Low" },
};

const STATUS_LABEL: Record<TaskStatus, { tr: string; en: string }> = {
  todo: { tr: "Yapılacak", en: "To do" },
  in_progress: { tr: "Devam ediyor", en: "In progress" },
  review: { tr: "İncelemede", en: "In review" },
};

export default function ProfileView() {
  const { language } = useApp();
  const { profile, completion, activeTasks, loading, saving, updateProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobRole, setJobRole] = useState<JobRole | "">("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [timezone, setTimezone] = useState("Europe/Istanbul");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const tr = language === "tr";

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setJobRole(profile.jobRole);
    setJobTitle(profile.jobTitle);
    setBio(profile.bio);
    setPhone(profile.phone);
    setLocation(profile.location);
    setWebsite(profile.website);
    setTimezone(profile.timezone || "Europe/Istanbul");
    setSkills(profile.skills);
    setAvatar(profile.avatar);
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveMsg({
        type: "error",
        text: tr ? "Görsel en fazla 2 MB olabilir." : "Image must be under 2 MB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v)) return;
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaveMsg(null);
    const ok = await updateProfile({
      name,
      email,
      jobRole,
      jobTitle,
      bio,
      phone,
      location,
      website,
      timezone,
      skills,
      avatar,
    });
    setSaveMsg(
      ok
        ? { type: "success", text: tr ? "Profil kaydedildi." : "Profile saved." }
        : { type: "error", text: tr ? "Kayıt başarısız." : "Save failed." }
    );
  };

  const handlePasswordSave = async (e: FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    setPwdLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwdMsg({ type: "error", text: data.message ?? (tr ? "Hata oluştu." : "Error.") });
        return;
      }
      setPwdMsg({ type: "success", text: data.message ?? (tr ? "Şifre güncellendi." : "Password updated.") });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPwdMsg({ type: "error", text: tr ? "Sunucu hatası." : "Server error." });
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>{tr ? "Yükleniyor…" : "Loading…"}</div>;
  }

  if (!profile) {
    return (
      <div className={styles.loading}>
        {tr ? "Profil yüklenemedi." : "Could not load profile."}
      </div>
    );
  }

  const pct = completion?.percent ?? 0;
  const inProgressTasks = activeTasks.filter((t) => t.status === "in_progress").length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{tr ? "Profilim" : "My Profile"}</h1>
          <p className={styles.subtitle}>
            {tr
              ? "Hesap bilgilerinizi ve tercihlerinizi yönetin"
              : "Manage your account details and preferences"}
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Sol kolon */}
        <aside className={styles.card}>
          <div className={styles.avatarBlock}>
            <div className={styles.avatar}>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={name} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={DEFAULT_AVATAR} alt={name} />
              )}
            </div>
            <button
              type="button"
              className={styles.avatarBtn}
              onClick={() => fileRef.current?.click()}
            >
              {tr ? "Fotoğrafı değiştir" : "Change photo"}
            </button>
            {avatar && (
              <button
                type="button"
                className={styles.avatarBtn}
                style={{ color: "#dc2626" }}
                onClick={() => setAvatar(null)}
              >
                {tr ? "Fotoğrafı kaldır" : "Remove photo"}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleAvatarChange}
            />
          </div>

          <div className={styles.completionWrap}>
            <div className={styles.ring} style={{ "--pct": pct } as React.CSSProperties}>
              <span className={styles.ringInner}>{pct}%</span>
            </div>
            <p className={styles.completionLabel}>
              {tr ? "Profil doluluk oranı" : "Profile completion"}
            </p>
            {completion && completion.missing.length > 0 && (
              <ul className={styles.missingList}>
                {completion.missing.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.statRow}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{activeTasks.length}</div>
              <div className={styles.statLabel}>{tr ? "Aktif görev" : "Active tasks"}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>{inProgressTasks}</div>
              <div className={styles.statLabel}>{tr ? "Devam eden" : "In progress"}</div>
            </div>
          </div>
        </aside>

        {/* Sağ kolon */}
        <div className="flex flex-col gap-5">
          <form className={styles.card} onSubmit={handleProfileSave}>
            <h2 className={styles.cardTitle}>{tr ? "Kişisel bilgiler" : "Personal info"}</h2>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  {tr ? "Ad soyad" : "Full name"}
                </label>
                <input
                  id="name"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="jobRole">
                  {tr ? "İş alanı" : "Job area"}
                </label>
                <select
                  id="jobRole"
                  className={styles.select}
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value as JobRole | "")}
                >
                  <option value="">{tr ? "Seçin…" : "Select…"}</option>
                  {JOB_ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label[language]}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="jobTitle">
                  {tr ? "Unvan" : "Job title"}
                </label>
                <input
                  id="jobTitle"
                  className={styles.input}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={tr ? "örn. Senior Frontend" : "e.g. Senior Frontend"}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label} htmlFor="bio">
                  {tr ? "Biyografi" : "Bio"}
                </label>
                <textarea
                  id="bio"
                  className={styles.textarea}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    tr
                      ? "Kendinizi kısaca tanıtın (en az 20 karakter doluluk için)"
                      : "Introduce yourself (20+ chars for completion)"
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="phone">
                  {tr ? "Telefon" : "Phone"}
                </label>
                <input
                  id="phone"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5xx xxx xx xx"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="location">
                  {tr ? "Konum" : "Location"}
                </label>
                <input
                  id="location"
                  className={styles.input}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={tr ? "İstanbul, TR" : "Istanbul, TR"}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="website">
                  {tr ? "Web sitesi" : "Website"}
                </label>
                <input
                  id="website"
                  className={styles.input}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="timezone">
                  {tr ? "Saat dilimi" : "Timezone"}
                </label>
                <select
                  id="timezone"
                  className={styles.select}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>{tr ? "Yetenekler" : "Skills"}</label>
                <div className={styles.skillsWrap}>
                  {skills.map((skill) => (
                    <span key={skill} className={styles.skillTag}>
                      {skill}
                      <button
                        type="button"
                        aria-label={tr ? "Kaldır" : "Remove"}
                        onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className={styles.skillInputRow}>
                  <input
                    className={styles.input}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder={tr ? "Yetenek ekle…" : "Add skill…"}
                  />
                  <button type="button" className={styles.addSkillBtn} onClick={addSkill}>
                    {tr ? "Ekle" : "Add"}
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.saveRow}>
              {saveMsg && (
                <span className={`${styles.message} ${styles[saveMsg.type]}`}>{saveMsg.text}</span>
              )}
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? (tr ? "Kaydediliyor…" : "Saving…") : tr ? "Kaydet" : "Save"}
              </button>
            </div>
          </form>

          <form className={styles.card} onSubmit={handlePasswordSave}>
            <h2 className={styles.cardTitle}>{tr ? "Şifre" : "Password"}</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label} htmlFor="currentPassword">
                  {tr ? "Mevcut şifre" : "Current password"}
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className={styles.input}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="newPassword">
                  {tr ? "Yeni şifre" : "New password"}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirmPassword">
                  {tr ? "Yeni şifre (tekrar)" : "Confirm password"}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className={styles.saveRow}>
              {pwdMsg && (
                <span className={`${styles.message} ${styles[pwdMsg.type]}`}>{pwdMsg.text}</span>
              )}
              <button type="submit" className={styles.saveBtn} disabled={pwdLoading}>
                {pwdLoading
                  ? tr
                    ? "Güncelleniyor…"
                    : "Updating…"
                  : tr
                    ? "Şifreyi güncelle"
                    : "Update password"}
              </button>
            </div>
          </form>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{tr ? "Aktif görevler" : "Active tasks"}</h2>
            <div className={styles.taskList}>
              {activeTasks.map((task) => (
                <article key={task.id} className={styles.taskItem}>
                  <div className={styles.taskTop}>
                    <div>
                      <p className={styles.taskTitle}>{task.title}</p>
                      <p className={styles.taskProject}>{task.project}</p>
                    </div>
                  </div>
                  <div className={styles.taskMeta}>
                    <span
                      className={`${styles.badge} ${
                        task.priority === "high"
                          ? styles.priorityHigh
                          : task.priority === "medium"
                            ? styles.priorityMedium
                            : styles.priorityLow
                      }`}
                    >
                      {PRIORITY_LABEL[task.priority][language]}
                    </span>
                    <span
                      className={`${styles.badge} ${
                        task.status === "todo"
                          ? styles.statusTodo
                          : task.status === "in_progress"
                            ? styles.statusProgress
                            : styles.statusReview
                      }`}
                    >
                      {STATUS_LABEL[task.status][language]}
                    </span>
                    <span className={styles.dueDate}>
                      {tr ? "Son tarih:" : "Due:"}{" "}
                      {new Date(task.dueDate).toLocaleDateString(
                        language === "tr" ? "tr-TR" : "en-US"
                      )}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
