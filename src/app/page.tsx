import MainPage from "@/components/MainPage";
import { cookies } from "next/headers";

export default async function Home() {
  const layout = cookies().get("react-resizable-panels:layout");

  return (
    <main className="flex min-h-[90vh] py-12 w-full">
      <div className="z-10 w-full font-mono text-sm lg:flex">
        <MainPage layout={layout!} />
      </div>
    </main>
  );
}
