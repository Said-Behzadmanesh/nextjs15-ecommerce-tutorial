// import { PrismaClient } from "@/generated/prisma";


// const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// export const prisma =
//     globalForPrisma.prisma ??
//     new PrismaClient({
//         log: ["query"],
//     });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

// lib/prisma.ts (with Accelerate enabled)

import { PrismaClient } from '@/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
    // Use .$extends() to add Accelerate's functionality
    return new PrismaClient().$extends(withAccelerate());
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();


if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}


export default prisma;