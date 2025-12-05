import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, "First name must start with a letter and can only contain letters with spaces between words"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, "Last name must start with a letter and can only contain letters with spaces between words"),
  email: z.string().trim().email("Invalid email format"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export const loginUserSchema = z.object({
  email: z.string().trim().email("Invalid email format"),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});
