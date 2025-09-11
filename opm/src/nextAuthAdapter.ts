import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const nextAuthAdapter = PrismaAdapter(prisma);

export default nextAuthAdapter;
