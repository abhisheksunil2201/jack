import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/components/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

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

      const mainInfoUpsert = await db.mainInfo.upsert({
        where: { userId },
        update: {
          curiousAbout: curiousAbout as string,
          excitedAbout: excitedAbout as string,
          profilePic: profilePic as string,
        },
        create: {
          userId: userId,
          curiousAbout: curiousAbout as string,
          excitedAbout: excitedAbout as string,
          profilePic: profilePic as string,
        },
      });

      if (mainInfoUpsert) {
        await db.user.update({
          where: { id: userId },
          data: {
            mainInfoAdded: true,
          },
        });
      }

      return { success: true };
    }),
  getAiChatMessages: privateProcedure
    .input(
      z.object({
        chatId: z.string(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { chatId, cursor } = input;
      const limit = INFINITE_QUERY_LIMIT;
      const messages = await db.aIMessage.findMany({
        take: limit + 1,
        where: { chatId },
        orderBy: { timestamp: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          timestamp: true,
          text: true,
          isUserMessage: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }
      return {
        messages,
        nextCursor,
      };
    }),
});

export type AppRouter = typeof appRouter;
