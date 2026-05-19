import type { ProfileCompletion, UserProfile } from "./types";

type CompletionField = {
  key: string;
  label: string;
  weight: number;
  filled: (p: UserProfile) => boolean;
};

const FIELDS: CompletionField[] = [
  { key: "avatar", label: "Profil fotoğrafı", weight: 15, filled: (p) => !!p.avatar },
  { key: "name", label: "Ad soyad", weight: 10, filled: (p) => p.name.trim().length >= 2 },
  { key: "email", label: "E-posta", weight: 10, filled: (p) => p.email.includes("@") },
  {
    key: "job",
    label: "İş alanı / unvan",
    weight: 15,
    filled: (p) => !!p.jobRole || p.jobTitle.trim().length >= 2,
  },
  { key: "bio", label: "Biyografi", weight: 20, filled: (p) => p.bio.trim().length >= 20 },
  { key: "phone", label: "Telefon", weight: 10, filled: (p) => p.phone.trim().length >= 8 },
  { key: "location", label: "Konum", weight: 10, filled: (p) => p.location.trim().length >= 2 },
  { key: "skills", label: "Yetenekler", weight: 10, filled: (p) => p.skills.length > 0 },
];

export function calculateProfileCompletion(profile: UserProfile): ProfileCompletion {
  let percent = 0;
  let filled = 0;
  const missing: string[] = [];

  for (const field of FIELDS) {
    if (field.filled(profile)) {
      percent += field.weight;
      filled += 1;
    } else {
      missing.push(field.label);
    }
  }

  return { percent, filled, total: FIELDS.length, missing };
}
