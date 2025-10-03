"use server";

import prisma from "@/lib/prisma"
import { RegisterSchema, RegisterSchemaType } from "../schemas";
import { hashPassword } from "../auth";

export async function registerUser(data: RegisterSchemaType) {
    const validationResult = RegisterSchema.safeParse(data);

    if (!validationResult.success) {
        return {
            success: false,
            error: "Invalid data",
            issues: validationResult.error.flatten().fieldErrors,
        }
    }

    const { email, password, name } = validationResult.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return {
                success: false,
                error: "User already exists with this email",
            }
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: "user",
            },
        });

        const userWithoutPassword = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        };

        return {
            success: true,
            user: userWithoutPassword
        }

    } catch (error) {
        console.error("Registration error", error);
        return {
            success: false,
            error: "An error occurred while registering",
        }
    }
}