import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export const getSessionServer = async () => {
  return await getServerSession(authOptions);
};