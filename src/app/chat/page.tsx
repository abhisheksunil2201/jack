import ChatScreen from "@/components/chat/ChatScreen";
import { cookies } from "next/headers";

export default async function Chat() {
  const layout = cookies().get("react-resizable-panels:layout");

  return (
    <main className="flex min-h-[90vh] py-12 w-full">
      <div className="z-10 w-full font-mono text-sm lg:flex">
        <ChatScreen layout={layout!} />
      </div>
    </main>
  );
}
