import { BasicInfoForm } from "@/components/forms/BasicInfoForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// import { UserDataForm } from "@/components/forms/UserDataForm";
import { UserFormQuestions } from "@/components/utils/form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* <UserDataForm questions={UserFormQuestions.mainForm} /> */}
        <MaxWidthWrapper>
          <BasicInfoForm questions={UserFormQuestions.basics} />
        </MaxWidthWrapper>
      </div>
    </main>
  );
}
