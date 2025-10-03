import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
});

// LoginSchema.parse({
//     email: "test@me.com",
//     password: "Password1",
// });

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters long",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;