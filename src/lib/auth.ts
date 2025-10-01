import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const parsedCredentials = LoginSchema.safeParse(credentials);
                if (!parsedCredentials.success) {
                    console.log("Invalid credentials");
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });

                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    const isPasswordValid = await comparePasswords(password, user.password);

                    if (!isPasswordValid) {
                        console.log("Invalid password");
                        return null;
                    }

                    return user;

                } catch (error) {
                    console.error("User not found", error);
                    return null;
                }
            },
        })
    ],
    pages: {
        signIn: "/auth/signin",
    }
})

export async function hashPassword(password: string) {
    const saltRounds = 10;

    return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}