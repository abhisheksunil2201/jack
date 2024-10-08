import React, { useContext, useEffect, useRef } from "react";
import { Messages as MessagesType } from "@/types/message";
import Message from "./Message";
import { Skeleton } from "../ui/skeleton";
import { useIntersection } from "@mantine/hooks";
import Discover from "../Discover";
import ChatInput from "./ChatInput";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { ChatContext } from "./ChatContext";

function Messages() {
  const { chatId } = useParams<{ chatId: string }>();
  const { isLoading: isAILoading } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getAiChatMessages.useInfiniteQuery(
      {
        chatId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages: MessagesType =
    data?.pages.flatMap((page) => page.messages) ?? [];

  const loadingMessage = {
    timestamp: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAILoading ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);

  return (
    <div className="flex h-full overflow-hidden max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      <ChatInput />
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i].isUserMessage;
          if (i === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                inNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
                key={message.id}
              />
            );
          } else
            return (
              <Message
                inNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
                key={message.id}
              />
            );
        })
      ) : isLoading ? (
        <div className="w-4 flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <Discover />
      )}
    </div>
  );
}

export default Messages;
