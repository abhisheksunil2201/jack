import { BasicInfoForm } from "@/components/forms/BasicInfoForm";
import { UserDataForm } from "@/components/forms/UserDataForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UserFormQuestions } from "@/components/utils/form";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/components/db";

export default async function MainPage() {
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

  if (dbUser.mainInfoAdded) redirect("/chat");

  return (
    <MaxWidthWrapper>
      <UserDataForm questions={UserFormQuestions.mainForm} />
    </MaxWidthWrapper>
  );
}
