import { z } from "zod";


// Profile Schema using zod
export const profileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .regex(/^[A-Za-z](?:[A-Za-z ]*[A-Za-z])?$/, "First name can contain only letters and spaces between characters"),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .regex(/^[A-Za-z](?:[A-Za-z ]*[A-Za-z])?$/, "Last name can contain only letters and spaces between characters"),
    dateOfBirth: z.date().refine(
        (dob) => {
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDifference = today.getMonth() - dob.getMonth();
            const dayDifference = today.getDate() - dob.getDate();

            // Adjust age if the user hasn't had their birthday this year yet
            if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
                return age > 18; // This will ensure the user is at least 18
            }
            return age >= 18;
        },
        {
            message: "You must be at least 18 years old.",
        }
    ),
    city: z.string().trim().min(1, "City is required"),
    postalCode: z
        .string()
        .min(1, "Postal Code is required")
        .regex(/^\d{5}$/, "Zip Code must be exactly 5 digits"),
    address: z.string().trim().min(1, "Address is required"),
    state: z
        .object({
            value: z.union([z.number(), z.null()]), // Allow it to be a number or null
            label: z.string().optional(),
        })
        .refine((data) => data.value !== null, {
            message: "State is required",
        }),
    title: z.object({
        value: z.union([z.string(), z.null()]), // Allow it to be a number or null
        label: z.string().optional(),
    }).refine((data) => data.value !== null, {
        message: "Title is required",
    }),
    gender: z
        .object({
            value: z.union([z.string(), z.null()]), // Allow it to be a number or null
            label: z.string().optional(),
        })
        .refine((data) => data.value !== null, {
            message: "Gender is required",
        }),
});


// Password Schema using zod
export const passwordSchema = z.object({
    oldPassword: z
        .string()
        .nonempty("Old password is required"),
    newPassword: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
            "Password must be at least 8 characters long, include at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character"
        ),
    confirmPassword: z
        .string()
        .nonempty("Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // This indicates the field where the error will appear
});



// Zod email schema
export const emailSchema = z.object({
    email: z.string().email("Invalid email format"), // Email validation rule
});
