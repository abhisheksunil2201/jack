import React from "react";
import Messages from "./Messages";
import { ChatContextProvider } from "./ChatContext";
import { useParams } from "next/navigation";

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>();
  return (
    <ChatContextProvider chatId={chatId}>
      <div className="h-full">
        <Messages />
      </div>
    </ChatContextProvider>
  );
}
