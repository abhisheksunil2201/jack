import { BasicInfoForm } from "@/components/forms/BasicInfoForm";
import { UserDataForm } from "@/components/forms/UserDataForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UserFormQuestions } from "@/components/utils/form";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function MainPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login?post_login_redirect_url=/");
  }
  return (
    <MaxWidthWrapper>
      <UserDataForm questions={UserFormQuestions.mainForm} />
      <BasicInfoForm questions={UserFormQuestions.basics} />
    </MaxWidthWrapper>
  );
}
