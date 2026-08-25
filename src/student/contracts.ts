import type { StudentId } from "./ids";

export type StudentMode = "LOCAL" | "ACCOUNT";
export type OnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface StudentProfile {
  id: StudentId;
  displayName: string;
  initials: string;
  mode: StudentMode;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentProfileInput {
  displayName: string;
}

export interface UpdateStudentProfileInput {
  displayName?: string;
  onboardingStatus?: OnboardingStatus;
}

export interface StudentRepository {
  getActiveProfile(): Promise<StudentProfile | null>;
  listProfiles(): Promise<StudentProfile[]>;
  createProfile(input: CreateStudentProfileInput): Promise<StudentProfile>;
  activateProfile(studentId: StudentId): Promise<void>;
  updateProfile(
    studentId: StudentId,
    input: UpdateStudentProfileInput,
  ): Promise<StudentProfile>;
}
