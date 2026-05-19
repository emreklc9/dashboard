"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  ActiveTask,
  ProfileCompletion,
  ProfilePatch,
  UserProfile,
} from "@/lib/profile/types";

type ProfileContextValue = {
  profile: UserProfile | null;
  completion: ProfileCompletion | null;
  activeTasks: ActiveTask[];
  loading: boolean;
  saving: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<boolean>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletion | null>(null);
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) {
        setProfile(null);
        setCompletion(null);
        setActiveTasks([]);
        return;
      }
      const data = await res.json();
      setProfile(data.profile ?? null);
      setCompletion(data.completion ?? null);
      setActiveTasks(data.activeTasks ?? []);
    } catch {
      setProfile(null);
      setCompletion(null);
      setActiveTasks([]);
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, [refreshProfile]);

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      setSaving(true);
      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok || !data.success) return false;
        setProfile(data.profile ?? null);
        setCompletion(data.completion ?? null);
        return true;
      } catch {
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        completion,
        activeTasks,
        loading,
        saving,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
