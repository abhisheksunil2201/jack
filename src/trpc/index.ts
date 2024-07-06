import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/components/db";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          userId: user.id,
        },
      });
    }

    return { success: true };
  }),
  createMainUserInfo: privateProcedure
    .input(
      z.object({
        curiousAbout: z.string().min(10).nullish(),
        excitedAbout: z.string().min(10).nullish(),
        profilePic: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { curiousAbout, excitedAbout, profilePic } = input;
      console.log("Creating");

      await db.mainInfo.upsert({
        where: { id: userId },
        update: {
          curiousAbout: curiousAbout as string,
          excitedAbout: excitedAbout as string,
          profilePic: profilePic as string,
        },
        create: {
          id: userId,
          userId: userId,
          curiousAbout: curiousAbout as string,
          excitedAbout: excitedAbout as string,
          profilePic: profilePic as string,
        },
      });
      console.log("created");
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
