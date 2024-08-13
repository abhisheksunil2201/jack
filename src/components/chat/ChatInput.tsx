import React, { useContext, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { ArrowRight } from "lucide-react";
import { ChatContext } from "./ChatContext";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";

function ChatInput({ isDisabled = false }) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  const { chatId } = useParams<{ chatId: string }>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="relative h-10 w-full mt-32">
      <Textarea
        placeholder="message jack"
        ref={textareaRef}
        rows={1}
        maxRows={4}
        autoFocus
        onChange={handleInputChange}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addMessage({ chatId });
            textareaRef.current?.focus();
          }
        }}
        className="resize-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 scrolling-touch"
        disabled={isDisabled}
      />
      <Button
        disabled={isDisabled || isLoading}
        variant={"ghost"}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 p-0 hover:bg-transparent"
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

export default ChatInput;
