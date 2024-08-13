import MainPage from "@/components/MainPage";

export default async function Home() {
  return (
    <main className="flex min-h-[90vh] py-12 w-full">
      <div className="z-10 w-full font-mono text-sm lg:flex">
        <MainPage />
      </div>
    </main>
  );
}
