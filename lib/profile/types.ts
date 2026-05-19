export type JobRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "design_ux"
  | "product"
  | "devops"
  | "mobile"
  | "qa"
  | "other";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "review";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  /** Sistem rolü (admin, editor…) */
  role: string;
  avatar: string | null;
  jobRole: JobRole | "";
  jobTitle: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  skills: string[];
  timezone: string;
  updatedAt: string;
};

export type ProfileCompletion = {
  percent: number;
  filled: number;
  total: number;
  missing: string[];
};

export type ActiveTask = {
  id: string;
  title: string;
  project: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
};

export type ProfilePatch = Partial<
  Pick<
    UserProfile,
    | "name"
    | "avatar"
    | "jobRole"
    | "jobTitle"
    | "bio"
    | "phone"
    | "location"
    | "website"
    | "skills"
    | "timezone"
  >
> & {
  email?: string;
};
