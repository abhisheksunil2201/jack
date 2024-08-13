import React from "react";
import Messages from "./Messages";
import { ChatContextProvider } from "./ChatContext";

export default function Chat() {
  return (
    <ChatContextProvider>
      <div className="h-full">
        <Messages />
      </div>
    </ChatContextProvider>
  );
}
