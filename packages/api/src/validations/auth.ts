import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string(),
    passwordConfirm: z
      .string()
      .min(1, "Please confirm your password")
      .max(32, "Password must be less than 32 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = loginSchema
  .pick({ password: true })
  .extend({
    passwordConfirm: z.string().min(1, "Please confirm your password"),
    resetToken: z.string().min(1, "Reset token is required"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export const settingsSchema = z.object({
  name: z.string().max(32, "Name must be less than 32 characters"),
});

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;
export type IForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type IResetPassword = z.infer<typeof resetPasswordSchema>;
export type ISettings = z.infer<typeof settingsSchema>;
