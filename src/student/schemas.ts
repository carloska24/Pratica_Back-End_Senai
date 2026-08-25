import { z } from "zod";

import { asStudentId } from "./ids";

const isoTimestampSchema = z.string().datetime({ offset: true });

export const displayNameSchema = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(1, "Display name is required.")
      .max(80, "Display name must have at most 80 characters.")
      .refine(
        (value) => !/[\u0000-\u001F\u007F]/.test(value),
        "Display name contains control characters.",
      ),
  );

export const studentProfileSchema = z
  .object({
    id: z.string().transform(asStudentId),
    displayName: displayNameSchema,
    initials: z.string().min(1).max(4),
    mode: z.enum(["LOCAL", "ACCOUNT"]),
    onboardingStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .strict();

export const studentIndexSchema = z.array(z.string().transform(asStudentId));
