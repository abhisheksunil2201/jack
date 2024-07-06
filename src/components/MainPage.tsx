import { BasicInfoForm } from "@/components/forms/BasicInfoForm";
import { UserDataForm } from "@/components/forms/UserDataForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UserFormQuestions } from "@/components/utils/form";

export default async function MainPage() {
  return (
    <MaxWidthWrapper>
      <UserDataForm questions={UserFormQuestions.mainForm} />
      <BasicInfoForm questions={UserFormQuestions.basics} />
    </MaxWidthWrapper>
  );
}
