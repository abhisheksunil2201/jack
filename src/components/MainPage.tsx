import { BasicInfoForm } from "@/components/forms/BasicInfoForm";
import { UserDataForm } from "@/components/forms/UserDataForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UserFormQuestions } from "@/components/utils/form";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/components/db";
import ChatScreen from "./chat/ChatScreen";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

interface MainPageProps {
  layout: RequestCookie;
}

export default async function MainPage({ layout }: MainPageProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) {
    redirect("/sign-in");
  }
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback");

  return (
    <MaxWidthWrapper>
      {!dbUser.mainInfoAdded ? (
        <UserDataForm questions={UserFormQuestions.mainForm} />
      ) : (
        <ChatScreen layout={layout} />
      )}
    </MaxWidthWrapper>
  );
}
