import { z } from "zod";
import { validateEmail } from "@/shared/utils/validations";

const emailValidator = z
  .string()
  .min(1, "Email is required")
  .refine(validateEmail, { message: "Enter a valid email" });

export const loginSchema = z.object({
  email: emailValidator,
  password: z.string().min(8, "Minimum 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
