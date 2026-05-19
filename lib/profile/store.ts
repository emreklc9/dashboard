import { authenticateUser } from "@/lib/auth/users";
import type { ProfilePatch, UserProfile } from "./types";

/** Fake profil veritabanı (sunucu yeniden başlayınca sıfırlanır) */
const profiles = new Map<string, UserProfile>();

const SEED: UserProfile = {
  id: "usr-1",
  email: "cordelio@dev.com",
  name: "Cordelio Admin",
  role: "admin",
  avatar: null,
  jobRole: "fullstack",
  jobTitle: "Lead Developer",
  bio: "",
  phone: "",
  location: "Ankara, TR",
  website: "",
  skills: ["React", "Next.js", "TypeScript"],
  timezone: "Europe/Istanbul",
  updatedAt: new Date().toISOString(),
};

function ensureProfile(userId: string): UserProfile {
  let profile = profiles.get(userId);
  if (!profile) {
    profile = { ...SEED, id: userId };
    profiles.set(userId, profile);
  }
  return profile;
}

export function getProfileByUserId(userId: string): UserProfile {
  return { ...ensureProfile(userId) };
}

export function updateProfileByUserId(
  userId: string,
  patch: ProfilePatch
): UserProfile | null {
  const current = ensureProfile(userId);
  const next: UserProfile = {
    ...current,
    ...patch,
    id: userId,
    email: patch.email?.trim() ?? current.email,
    name: patch.name?.trim() ?? current.name,
    jobTitle: patch.jobTitle?.trim() ?? current.jobTitle,
    bio: patch.bio?.trim() ?? current.bio,
    phone: patch.phone?.trim() ?? current.phone,
    location: patch.location?.trim() ?? current.location,
    website: patch.website?.trim() ?? current.website,
    timezone: patch.timezone?.trim() ?? current.timezone,
    skills: patch.skills ?? current.skills,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(userId, next);
  return { ...next };
}

export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): { ok: true } | { ok: false; message: string } {
  const profile = ensureProfile(userId);
  const auth = authenticateUser(profile.email, currentPassword);
  if (!auth) {
    return { ok: false, message: "Mevcut şifre hatalı." };
  }
  if (newPassword.length < 6) {
    return { ok: false, message: "Yeni şifre en az 6 karakter olmalı." };
  }
  // Fake backend: gerçek şifre users.ts içinde; demo için sadece doğrulama yapıyoruz
  return { ok: true };
}
